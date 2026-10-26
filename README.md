# WVAS Exhibition Home

One address and one QR code for everything about a WVAS exhibition. A single
static page (`public/index.html`), no build step and no secrets.

## What it shows

The page switches automatically by date, using the settings saved on the
entry form's settings page (Exhibition Admin → Entry Form Settings, at
`/admin/settings/`):

| Phase | When | Aimed at |
|---|---|---|
| Coming soon | before "Entries Open On" | everyone: what's next |
| Entries open | from "Entries Open On" until the entry cut-off | artists: enter, how to enter, stewarding, profiles, key dates |
| Entries closed | after the cut-off, before "Exhibition Opens On" | artists: stewarding, key dates |
| Exhibition on | "Exhibition Opens On" to "Exhibition Closes On" | visitors: catalogue, artists, find us |
| Between exhibitions | after "Exhibition Closes On" | everyone: photo, next exhibition |

Title, dates, opening times and "Next exhibition" all come from that page;
nothing here needs editing between exhibitions. The accent colour follows the
title: "Spring" gives blossom pink, anything else the house gold.

## Previewing a phase

Add `?phase=artists`, `?phase=closed`, `?phase=visitors`, `?phase=between`
or `?phase=upcoming` to the address, or `?date=2027-04-10` to see the page
as it will look on that day. Nothing is changed for anyone else.

## Changing a link

All the other sites' addresses are in the `LINKS` block at the top of the
script in `public/index.html`. The Find us text is in `findUsPanel()`.

## Exhibition Admin (`/admin/`)

The footer's "Exhibition Admin" link opens `/admin/`. Those pages actually
live on the entry form site (which holds the Google Sheets key); `netlify.toml`
proxies `/admin/*` and `/admin-api/*` through to `wvas-ex-entry.netlify.app`,
so this site needs no secrets of its own. Passwords are set on the entry form
site: `PRINTING_PASSWORD` for printing, `ADMIN_PASSWORD` for settings.
