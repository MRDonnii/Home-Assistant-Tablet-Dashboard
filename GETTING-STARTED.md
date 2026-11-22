# Getting Started

This guide takes you from a fresh copy of the repo to a working dashboard behind nginx.

## What you need

- an nginx server
- a running Home Assistant instance
- either:
  - Home Assistant login through the browser, or
  - a long-lived access token

## Repo structure

- `www/` - the actual dashboard files nginx should serve
- `nginx/` - sample nginx config
- `serve-dashboard.ps1` - optional local test server for Windows
- `config.example.json` and `dashboard-auth.example.json` - examples only

## Option 1: Run it behind nginx

1. Copy the repo to your server.
2. Point nginx to the `www/` folder as the web root.
3. Open the sample config in `nginx/site-confs/default.conf.sample`.
4. Adjust the root path so it points to your `www/` folder.
5. If you want the dashboard to talk to Home Assistant through the same domain, add a `/ha` reverse proxy to your Home Assistant instance.
6. Restart nginx.

Example idea:

```nginx
server {
    listen 80;
    server_name _;

    root /path/to/Home-Assistant-Tablet-Dashboard/www;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /ha/ {
        proxy_pass http://YOUR_HOME_ASSISTANT:8123/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

If your nginx config already proxies Home Assistant somewhere else, you can also enter the full Home Assistant URL in the dashboard settings instead of using `/ha`.

## Option 2: Test it locally on Windows

Run:

```powershell
.\serve-dashboard.ps1
```

That serves the dashboard locally for testing. It is useful before moving it into nginx.

## First login

1. Open the dashboard in a browser.
2. Open Settings.
3. Enter either:
   - `/ha` if nginx is proxying Home Assistant, or
   - the full Home Assistant URL, such as `http://homeassistant.example.local:8123`
4. Log in with the built-in Home Assistant login flow, or paste a long-lived token.

## First setup inside the dashboard

After login:

1. Press `Suggest entities`
2. Review the suggested entities
3. Adjust the important sections:
   - core entities
   - utility entities
   - room definitions
   - camera entities
   - kiosk entities if you use kiosk control
   - vehicle entities if you use the vehicle card
4. Save settings
5. Refresh the page

## Why it may not work immediately

This repo is a template version. It does not include your real Home Assistant entity names.

That means these parts usually need manual setup on a new installation:

- room aliases
- temperature and humidity sensors
- camera entities
- power and price sensors
- waste sensors
- optional kiosk and vehicle entities

## Common issues

### The page opens, but no data shows

Usually one of these is wrong:

- Home Assistant URL
- login/token
- reverse proxy path
- browser cannot reach Home Assistant from that device

### The dashboard loads, but some cards are empty

That usually means the entity mapping does not match your Home Assistant setup yet. Use `Suggest entities` and then adjust the missing ones manually.

### Login works, but service calls fail

Check:

- that the account has permission in Home Assistant
- that nginx forwards requests correctly
- that the dashboard is using the right HA base URL

## Privacy and secrets

Do not commit real secrets back into the repo.

Keep these local only:

- `dashboard-auth.json`
- real tokens
- private certificates
- machine-specific kiosk config

## Recommended first success path

If you want the smoothest setup:

1. get `www/` loading in nginx
2. make `/ha` proxy correctly to Home Assistant
3. log in from the dashboard
4. run `Suggest entities`
5. fix the missing rooms and cards one by one

That gets you to a working baseline the fastest.
