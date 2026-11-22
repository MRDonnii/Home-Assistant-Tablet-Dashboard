on run argv
	set foregroundApp to item 1 of argv
	set allowedCsv to item 2 of argv
	set AppleScript's text item delimiters to ","
	set allowedList to text items of allowedCsv
	
	tell application "System Events"
		repeat with procRef in (application processes whose background only is false)
			set procName to name of procRef
			if procName is not in allowedList then
				try
					set visible of procRef to false
				end try
			end if
		end repeat
	end tell
	
	try
		tell application foregroundApp to activate
	end try
end run
