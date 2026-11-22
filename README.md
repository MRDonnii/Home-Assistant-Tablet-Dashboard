# Home Assistant Tablet Dashboard

A cleaned and reusable tablet dashboard for Home Assistant. The repo includes the dashboard UI, sample nginx config, optional local helper scripts, and example config files without private entities or tokens.

Start here if you want a practical setup walkthrough:

- [GETTING-STARTED.md](./GETTING-STARTED.md)

## Repo layout

- `www/` - the dashboard frontend that nginx should serve.
- `nginx/` - sample nginx config for hosting the dashboard and proxying Home Assistant.
- `serve-dashboard.ps1` - optional local PowerShell dev server/proxy.
- `mac-kiosk/` - optional macOS kiosk helper files.
- `config.example.json` and `dashboard-auth.example.json` - example config only.

## Quick start

1. Serve the `www/` folder from nginx.
2. If you want same-origin API calls, proxy `/ha` from nginx to your Home Assistant instance.
3. Open the dashboard in a browser.
4. Log in through the built-in Home Assistant login flow or add your own token in Settings.
5. Use `Suggest entities` in Settings and then adjust the mapped entities for your setup.

For local testing you can also run:

```powershell
.\serve-dashboard.ps1
```

## How setup works

The dashboard is a static frontend. It reads entities from Home Assistant and sends service calls back through the Home Assistant API.

Most setups only need:

- a reachable Home Assistant URL
- a valid Home Assistant login or long-lived access token
- your own entity mappings in Settings

The advanced Settings panel lets you map:

- main card entities
- utility sensors
- waste sensors
- climate entities
- kiosk entities
- vehicle entities
- room definitions
- room popup config

## Privacy

This repo intentionally excludes local secrets, certificates, logs, backups, and machine-specific config. Do not commit:

- `dashboard-auth.json`
- certificates or private keys
- log files
- local kiosk config with passwords
- real Home Assistant tokens

## Notes

This is a template version, not a one-click Home Assistant addon. It is ready to host on a clean nginx install, but each Home Assistant setup still needs its own URLs, login, and entity mapping.
