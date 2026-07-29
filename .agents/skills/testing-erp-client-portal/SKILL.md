---
name: testing-erp-client-portal
description: How to run and UI-test the Angular frontend of erp-client-portal locally (dev server, known case-sensitivity build bug, mock data, page routes).
---

# Testing the erp-client-portal frontend

## Run the app
```bash
source ~/.nvm/nvm.sh && nvm use 22
cd frontend && npm ci            # once
npx ng serve --port 4300
```
Open `http://localhost:4300/<route>` (always include the `http://` scheme). **No login is required** — the layout is rendered with a hardcoded mock user ("Claire Martin"), so any route is directly reachable.

Routes seen so far: `/dashboard`, `/products`, `/orders`, `/deliveries`, `/documents`, `/support`, `/activity`, `/settings`.

## Known blocker: `Core` vs `core` directory case
`frontend/src/app/Core` is imported everywhere as `../core/...`. On a case-sensitive filesystem (Linux) `ng build` / `ng serve` fails. Workaround (do NOT commit):
```bash
cd frontend/src/app && mv Core core_tmp && mv core_tmp core   # apply
cd frontend/src/app && mv core Core_tmp && mv Core_tmp Core   # revert when done
```
After applying it, **hard-reload the browser (Ctrl+Shift+R)** before judging styling: a stale HMR state can render Material dialogs completely unstyled and look like a CSS regression when it is not.

## Data
All pages read from static mock arrays in `frontend/src/app/Core/models/mock-data.ts` (`orders`, `orderLines`, `orderTracking`, `deliveries`, `invoices`, ...). There is no backend to seed: to test a state that does not exist in the mocks (e.g. a cancelled order), you must temporarily edit that file. Read exact expected values (amounts, dates, references) from this file to write hard assertions.

## Angular specifics that affect testing
- Dialogs are `ng-template` opened via `MatDialog` from the page component. If the code navigates away without closing the dialog, the overlay survives but **loses the component's scoped styles** — an unstyled dialog floating over the next page is a real product bug, and the fix is to call `dialogRef.close()` around the navigation.
- Component CSS uses `:host, .some-dialog { --vars }` so dialog content keeps its theme variables outside `:host` scope.
- To check responsive layouts, resize the real window instead of using devtools:
  `DISPLAY=:0 wmctrl -r :ACTIVE: -b remove,maximized_vert,maximized_horz && DISPLAY=:0 xdotool getactivewindow windowsize 470 1000`
  (re-maximize with `wmctrl -r :ACTIVE: -b add,maximized_vert,maximized_horz`). The Chrome DISPLAY on this box is `:0`.
- Verify "no overflow" objectively with `document.documentElement.scrollWidth` vs `window.innerWidth` rather than eyeballing.

## Blob/file downloads
Features that generate files via `URL.createObjectURL` + `<a download>` land in `~/Downloads/`. Clear the directory before the test, then `cat` the file to assert its content.

## Devin Secrets Needed
None — the app is fully mock-driven and requires no credentials.
