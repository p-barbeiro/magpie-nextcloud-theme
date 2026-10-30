<div align="center">

# Magpie for Nextcloud

*A calm, panelled look for the Nextcloud Files app*

![Nextcloud 35](https://img.shields.io/badge/Nextcloud-35-0082C9?style=flat-square&logo=nextcloud&logoColor=white)
![Version 2.0.0](https://img.shields.io/badge/version-2.0.0-50A3E8?style=flat-square)
[![License: MIT](https://img.shields.io/badge/license-MIT-yellow?style=flat-square)](LICENSE)

[Features](#features) • [Screenshots](#screenshots) • [Install](#install) • [Compact rows](#compact-rows) • [Project structure](#project-structure) • [Known limitations](#known-limitations)

<img src="screenshots/light-sidebar.png" alt="Magpie: Nextcloud Files with a floating sidebar and a rounded file list panel" width="800" />

</div>

Magpie is a Nextcloud app that restyles **Files** with a floating sidebar, a full-width file list in a rounded panel and a quiet, neutral toolbar. It is CSS plus a few small scripts, uses Nextcloud's own color variables, and follows light and dark mode. It pairs with [Magpie for Immich](https://github.com/p-barbeiro/magpie-immich-theme), which gives your photo library the same header, colors and panels.

## Features

- **Floating, rounded sidebar** with the native folder tree, always visible on desktop.
- **Icons-only rail**: the sidebar collapses to icons, and the browser remembers the choice.
- **Full-width file list** in a rounded panel with zebra stripes and muted columns.
- **Compact rows**: a toggle next to the grid/list button switches between 28px and 44px rows.
- **Status bar** pinned to the bottom of the list.
- **Details panel** styled like the sidebar.
- **Clean header**: logo on the left, search on the right.
- **Guest and public share pages** in the same flat, rounded style, without the promotion footer.
- **Title bar color** for browsers and the installed web app follows the header.
- **Light and dark mode**, with accent `#50a3e8`.

Tested on Nextcloud **35.0.2**.

## Screenshots

| | Light | Dark |
| --- | --- | --- |
| Sidebar | ![Light, sidebar](screenshots/light-sidebar.png) | ![Dark, sidebar](screenshots/dark-sidebar.png) |
| Icons-only rail | ![Light, rail](screenshots/light-rail.png) | ![Dark, rail](screenshots/dark-rail.png) |

## Install

Clone the repository into your apps directory as `magpie` and enable it. With the official `nextcloud` Docker image (service `app`, apps in `custom_apps`):

```sh
docker compose exec -u www-data app sh -c \
  'git clone https://github.com/p-barbeiro/magpie-nextcloud-theme /var/www/html/custom_apps/magpie'
docker compose exec -u www-data app php occ app:enable magpie
```

No git in the container? Copy the folder in instead:

```sh
git archive --format=tar --prefix=magpie/ HEAD | \
  docker compose exec -T -u www-data app tar x -C /var/www/html/custom_apps
```

> [!NOTE]
> Versions 1.x used the app ID `finder_theme`. To upgrade, run `occ app:disable finder_theme`, delete `custom_apps/finder_theme`, then install `magpie` as above. Theming settings and the rail and compact preferences carry over.

### Recommended settings

```sh
# Accent and plain background used by the theme
occ theming:config primary_color "#50a3e8"
occ theming:config background backgroundColor
occ theming:config background_color "#1c1c1e"

# No folder description above the list
occ config:app:set text workspace_available --value=false --type=boolean
```

Hard-refresh the browser afterwards.

> [!TIP]
> After changing the CSS or JavaScript, bump `<version>` in `appinfo/info.xml` so browsers fetch the new files, then run `occ upgrade` right away: until then Nextcloud answers 503 (upgrade needed).

## Compact rows

The Files list is virtualized and hardcodes a 44px row height for its scroll math, so smaller rows need a small patch to the Files bundle. `bin/patch-files-main.sh` makes two exact substitutions in `dist/files-main.js`:

1. The row height comes from the compact toggle (28px or 44px).
2. The selection bar shows every batch action inline on wide windows, instead of three and a menu.

```sh
bin/patch-files-main.sh /var/www/html/dist/files-main.js
```

The script needs `python3`, keeps a `.orig` backup, is safe to run twice and stops with an error if a substitution no longer matches exactly once.

> [!IMPORTANT]
> Nextcloud updates replace `dist/`. Run the script again after every update, or compact rows leave gaps while scrolling large folders.

## Project structure

| Path | What it is |
| --- | --- |
| `css/magpie.css` | Files app styling |
| `css/guest.css` | Guest and public share pages |
| `js/rail.js` | Sidebar rail toggle |
| `js/compact.js` | Compact rows toggle |
| `js/theme-color.js` | Browser title bar color |
| `lib/` | Loads the styles and scripts on every page; the rail only for signed-in users |
| `bin/patch-files-main.sh` | Files bundle patch for compact rows |

## Known limitations

- **Compact rows depend on the bundle patch**, which has to be applied again after each Nextcloud update.
- **Toast position** relies on Nextcloud's CSS-module class prefix `_toastContainer_`. If an update renames it, toasts fall back to their native position; nothing breaks.
- The header search keeps Nextcloud's placeholder text.

> [!NOTE]
> Magpie is an independent project and is not affiliated with or endorsed by Nextcloud GmbH.
