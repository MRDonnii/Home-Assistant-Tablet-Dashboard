$ErrorActionPreference = "Stop"

$root = Join-Path $PSScriptRoot "www"
$listenPort = 8080
$listenAddresses = @("127.0.0.1")
$logDirectory = Join-Path $PSScriptRoot "logs"
$logFile = Join-Path $logDirectory "dashboard-server.log"
$homeAssistantBase = if ($env:HOME_ASSISTANT_BASE_URL) { $env:HOME_ASSISTANT_BASE_URL } else { "http://homeassistant.example.local:8123" }

if (-not (Test-Path -LiteralPath $logDirectory)) {
  New-Item -ItemType Directory -Path $logDirectory | Out-Null
}

$mimeTypes = @{
  ".html" = "text/html; charset=utf-8"
  ".css" = "text/css; charset=utf-8"
  ".js" = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".png" = "image/png"
  ".jpg" = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".gif" = "image/gif"
  ".svg" = "image/svg+xml"
  ".ico" = "image/x-icon"
  ".txt" = "text/plain; charset=utf-8"
}

try {
  $interfaceAddresses = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction Stop |
    Where-Object { $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.254*" } |
    Select-Object -ExpandProperty IPAddress
  if ($interfaceAddresses) {
    $listenAddresses += $interfaceAddresses
  }
} catch {
}

$listenAddresses = $listenAddresses | Select-Object -Unique

function Write-Log {
  param([string]$Message)
  $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  Add-Content -Path $logFile -Value "[$timestamp] $Message"
}

function Get-ProxyContentType {
  param($Response)
  if ($Response -and $Response.ContentType) {
    return $Response.ContentType
  }
  return "application/octet-stream"
}

function Get-StatusDescription {
  param([int]$StatusCode)

  switch ($StatusCode) {
    200 { "OK" }
    201 { "Created" }
    204 { "No Content" }
    400 { "Bad Request" }
    401 { "Unauthorized" }
    403 { "Forbidden" }
    404 { "Not Found" }
    405 { "Method Not Allowed" }
    500 { "Internal Server Error" }
    502 { "Bad Gateway" }
    default { "OK" }
  }
}

function Send-Response {
  param(
    [Parameter(Mandatory = $true)] [System.Net.Sockets.NetworkStream] $Stream,
    [Parameter(Mandatory = $true)] [int] $StatusCode,
    [Parameter(Mandatory = $true)] [byte[]] $BodyBytes,
    [Parameter(Mandatory = $true)] [string] $ContentType,
    [hashtable] $Headers = @{}
  )

  $writer = [System.IO.StreamWriter]::new($Stream, [System.Text.Encoding]::ASCII, 1024, $true)
  $writer.NewLine = "`r`n"
  $writer.WriteLine("HTTP/1.1 $StatusCode $(Get-StatusDescription -StatusCode $StatusCode)")
  $writer.WriteLine("Content-Type: $ContentType")
  $writer.WriteLine("Content-Length: $($BodyBytes.Length)")
  $writer.WriteLine("Connection: close")
  foreach ($key in $Headers.Keys) {
    $writer.WriteLine("${key}: $($Headers[$key])")
  }
  $writer.WriteLine()
  $writer.Flush()

  if ($BodyBytes.Length -gt 0) {
    $Stream.Write($BodyBytes, 0, $BodyBytes.Length)
    $Stream.Flush()
  }
}

function Send-TextResponse {
  param(
    [Parameter(Mandatory = $true)] [System.Net.Sockets.NetworkStream] $Stream,
    [Parameter(Mandatory = $true)] [int] $StatusCode,
    [Parameter(Mandatory = $true)] [string] $Body,
    [string] $ContentType = "text/plain; charset=utf-8"
  )

  $bytes = [System.Text.Encoding]::UTF8.GetBytes($Body)
  Send-Response -Stream $Stream -StatusCode $StatusCode -BodyBytes $bytes -ContentType $ContentType
}

function Read-HttpRequest {
  param([Parameter(Mandatory = $true)] [System.Net.Sockets.NetworkStream] $Stream)

  $buffer = New-Object byte[] 8192
  $requestBytes = New-Object System.Collections.Generic.List[byte]
  $headerEndIndex = -1

  while ($headerEndIndex -lt 0) {
    $read = $Stream.Read($buffer, 0, $buffer.Length)
    if ($read -le 0) {
      return $null
    }
    for ($i = 0; $i -lt $read; $i++) {
      [void]$requestBytes.Add($buffer[$i])
    }

    $rawArray = $requestBytes.ToArray()
    for ($i = 0; $i -le $rawArray.Length - 4; $i++) {
      if ($rawArray[$i] -eq 13 -and $rawArray[$i + 1] -eq 10 -and $rawArray[$i + 2] -eq 13 -and $rawArray[$i + 3] -eq 10) {
        $headerEndIndex = $i + 4
        break
      }
    }
  }

  $allBytes = $requestBytes.ToArray()
  $headerText = [System.Text.Encoding]::ASCII.GetString($allBytes, 0, $headerEndIndex)
  $headerLines = $headerText -split "`r`n"
  if (-not $headerLines[0]) {
    return $null
  }

  $requestLineParts = $headerLines[0].Split(" ")
  if ($requestLineParts.Length -lt 2) {
    return $null
  }

  $headers = @{}
  foreach ($line in $headerLines[1..($headerLines.Length - 1)]) {
    if ([string]::IsNullOrWhiteSpace($line)) {
      continue
    }
    $separator = $line.IndexOf(":")
    if ($separator -gt 0) {
      $name = $line.Substring(0, $separator).Trim()
      $value = $line.Substring($separator + 1).Trim()
      $headers[$name] = $value
    }
  }

  $contentLength = 0
  if ($headers.ContainsKey("Content-Length")) {
    [void][int]::TryParse($headers["Content-Length"], [ref]$contentLength)
  }

  $bodyBytes = @()
  $bodyAlreadyBuffered = $allBytes.Length - $headerEndIndex
  if ($contentLength -gt 0) {
    $bodyBuffer = New-Object byte[] $contentLength
    if ($bodyAlreadyBuffered -gt 0) {
      [Array]::Copy($allBytes, $headerEndIndex, $bodyBuffer, 0, [Math]::Min($bodyAlreadyBuffered, $contentLength))
    }

    $offset = [Math]::Max(0, [Math]::Min($bodyAlreadyBuffered, $contentLength))
    while ($offset -lt $contentLength) {
      $read = $Stream.Read($bodyBuffer, $offset, $contentLength - $offset)
      if ($read -le 0) {
        break
      }
      $offset += $read
    }
    $bodyBytes = $bodyBuffer
  }

  [pscustomobject]@{
    Method = $requestLineParts[0].ToUpperInvariant()
    RawPath = $requestLineParts[1]
    HttpVersion = if ($requestLineParts.Length -ge 3) { $requestLineParts[2] } else { "HTTP/1.1" }
    Headers = $headers
    BodyBytes = [byte[]]$bodyBytes
  }
}

function Resolve-StaticPath {
  param([string]$RequestPath)

  $pathOnly = $RequestPath.Split("?")[0]
  $relativePath = [System.Uri]::UnescapeDataString($pathOnly.TrimStart("/"))
  if ([string]::IsNullOrWhiteSpace($relativePath)) {
    $relativePath = "index.html"
  } elseif ($relativePath -eq "vertical") {
    $relativePath = "vertical.html"
  }

  $candidate = Join-Path $root $relativePath
  $resolvedRoot = [System.IO.Path]::GetFullPath($root)
  if (Test-Path $candidate -PathType Leaf) {
    $resolvedCandidate = [System.IO.Path]::GetFullPath($candidate)
    if ($resolvedCandidate.StartsWith($resolvedRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
      return $resolvedCandidate
    }
  }

  return (Join-Path $root "index.html")
}

function Handle-StaticRequest {
  param(
    [Parameter(Mandatory = $true)] [System.Net.Sockets.NetworkStream] $Stream,
    [Parameter(Mandatory = $true)] $Request
  )

  $path = Resolve-StaticPath -RequestPath $Request.RawPath
  $extension = [System.IO.Path]::GetExtension($path).ToLowerInvariant()
  $contentType = if ($mimeTypes.ContainsKey($extension)) { $mimeTypes[$extension] } else { "application/octet-stream" }
  $bodyBytes = [System.IO.File]::ReadAllBytes($path)
  Send-Response -Stream $Stream -StatusCode 200 -BodyBytes $bodyBytes -ContentType $contentType
}

function Copy-ProxyHeaders {
  param(
    [Parameter(Mandatory = $true)] $Request,
    [Parameter(Mandatory = $true)] [System.Net.HttpWebRequest] $ProxyRequest
  )

  foreach ($key in $Request.Headers.Keys) {
    $value = $Request.Headers[$key]
    switch -Regex ($key) {
      "^Host$" { continue }
      "^Connection$" { continue }
      "^Content-Length$" { continue }
      "^Accept$" { $ProxyRequest.Accept = $value; continue }
      "^Content-Type$" { $ProxyRequest.ContentType = $value; continue }
      "^User-Agent$" { $ProxyRequest.UserAgent = $value; continue }
      default {
        try {
          $ProxyRequest.Headers[$key] = $value
        } catch {
        }
      }
    }
  }
}

function Handle-ProxyRequest {
  param(
    [Parameter(Mandatory = $true)] [System.Net.Sockets.NetworkStream] $Stream,
    [Parameter(Mandatory = $true)] $Request
  )

  $pathAndQuery = $Request.RawPath.Substring(3)
  if (-not $pathAndQuery.StartsWith("/")) {
    $pathAndQuery = "/$pathAndQuery"
  }

  $targetUri = "$homeAssistantBase$pathAndQuery"

  try {
    Write-Log "Proxy $($Request.Method) $($Request.RawPath) -> $targetUri"
    $proxyRequest = [System.Net.HttpWebRequest]::Create($targetUri)
    $proxyRequest.Method = $Request.Method
    $proxyRequest.AllowAutoRedirect = $false
    $proxyRequest.Timeout = 60000
    $proxyRequest.ReadWriteTimeout = 60000
    Copy-ProxyHeaders -Request $Request -ProxyRequest $proxyRequest

    if ($Request.BodyBytes.Length -gt 0) {
      $proxyRequest.ContentLength = $Request.BodyBytes.Length
      $requestStream = $proxyRequest.GetRequestStream()
      try {
        $requestStream.Write($Request.BodyBytes, 0, $Request.BodyBytes.Length)
      } finally {
        $requestStream.Dispose()
      }
    }

    $proxyResponse = [System.Net.HttpWebResponse]$proxyRequest.GetResponse()
    try {
      $responseStream = $proxyResponse.GetResponseStream()
      $memory = New-Object System.IO.MemoryStream
      try {
        $responseStream.CopyTo($memory)
      } finally {
        $responseStream.Dispose()
      }

      $headers = @{}
      if ($proxyResponse.Headers["Cache-Control"]) { $headers["Cache-Control"] = $proxyResponse.Headers["Cache-Control"] }
      if ($proxyResponse.Headers["Pragma"]) { $headers["Pragma"] = $proxyResponse.Headers["Pragma"] }
      if ($proxyResponse.Headers["Expires"]) { $headers["Expires"] = $proxyResponse.Headers["Expires"] }
      if ($proxyResponse.Headers["Location"]) { $headers["Location"] = $proxyResponse.Headers["Location"] }

      Send-Response `
        -Stream $Stream `
        -StatusCode ([int]$proxyResponse.StatusCode) `
        -BodyBytes $memory.ToArray() `
        -ContentType (Get-ProxyContentType -Response $proxyResponse) `
        -Headers $headers
    } finally {
      $proxyResponse.Dispose()
    }
  } catch [System.Net.WebException] {
    $webException = $_.Exception
    if ($webException.Response) {
      $proxyResponse = [System.Net.HttpWebResponse]$webException.Response
      try {
        $responseStream = $proxyResponse.GetResponseStream()
        $memory = New-Object System.IO.MemoryStream
        try {
          $responseStream.CopyTo($memory)
        } finally {
          $responseStream.Dispose()
        }
        Send-Response `
          -Stream $Stream `
          -StatusCode ([int]$proxyResponse.StatusCode) `
          -BodyBytes $memory.ToArray() `
          -ContentType (Get-ProxyContentType -Response $proxyResponse)
      } finally {
        $proxyResponse.Dispose()
      }
    } else {
      Write-Log "Proxy failure: $($webException.Message)"
      Send-TextResponse -Stream $Stream -StatusCode 502 -Body "Proxy error: $($webException.Message)"
    }
  } catch {
    Write-Log "Proxy failure: $($_.Exception.Message)"
    Send-TextResponse -Stream $Stream -StatusCode 502 -Body "Proxy error: $($_.Exception.Message)"
  }
}

function Handle-Client {
  param([Parameter(Mandatory = $true)] [System.Net.Sockets.TcpClient] $Client)

  try {
    $stream = $Client.GetStream()
    $request = Read-HttpRequest -Stream $stream
    if (-not $request) {
      return
    }

    if ($request.RawPath.StartsWith("/ha")) {
      Handle-ProxyRequest -Stream $stream -Request $request
    } else {
      Handle-StaticRequest -Stream $stream -Request $request
    }
  } catch {
    try {
      $stream = $Client.GetStream()
      Send-TextResponse -Stream $stream -StatusCode 500 -Body "Server error: $($_.Exception.Message)"
    } catch {
    }
    Write-Log "Request handling failure: $($_.Exception.Message)"
  } finally {
    try { $Client.Close() } catch {}
  }
}

$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $listenPort)
$listener.Server.SetSocketOption([System.Net.Sockets.SocketOptionLevel]::Socket, [System.Net.Sockets.SocketOptionName]::ReuseAddress, $true)
$listener.Start()

Write-Host "Dashboard server running on port $listenPort"
$availableUrls = ($listenAddresses | ForEach-Object { "http://${_}:$listenPort/" }) -join ", "
Write-Host "Available at: $availableUrls"
Write-Host "Proxying /ha to $homeAssistantBase"
Write-Log "Server started on port $listenPort for $($listenAddresses -join ', ')"

try {
  while ($true) {
    $client = $listener.AcceptTcpClient()
    Handle-Client -Client $client
  }
} finally {
  Write-Log "Server stopping"
  $listener.Stop()
}
