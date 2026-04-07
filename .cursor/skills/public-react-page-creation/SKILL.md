---
name: public-react-page-creation
description: Add a new public React page/URL (route, nav, Bootstrap styling, and SPA deep-link support)
---

# Public React Page Creation

## Use when

- Adding a new screen reachable by a public URL (e.g. `/roadmap`, `/changelog`, `/api-docs`)
- Adding a new page that should be linkable/bookmarkable and appear in navigation

## Goal

Create the page end-to-end so it works via:

- client-side navigation (clicking links)
- direct load / refresh on the URL (deep link)

## Checklist

### Create the page component

- Create a new folder under `react-ui/src/<PageName>/`
  - `<PageName>.js`
  - `<PageName>.css` (if needed)
  - Keep structure consistent with similar existing pages.
- Use Bootstrap 5 classes for layout and spacing.
- Ensure headings and text are readable and scannable.

### Wire up routing

- Add a `Route` in `react-ui/src/Main.js` for the new path.
- Ensure it doesn’t conflict with existing routes.
- Note: `Main.js` wraps everything with `<Header/>` and `<Footer/>`, so page components should render only the page body.

### Add navigation (if appropriate)

- Add a link in `react-ui/src/Header/Header.js`.
- Ensure the active state/selected styling matches existing nav conventions.
- Convention:
  - encyclopedia resources go in the **Resources dropdown** via `RESOURCE_LINKS`
  - top-level non-resource pages (e.g. Roadmap) go on the right side of the navbar

### Ensure deep-link support on deploy

- This project already supports deep links via Express:
  - `express.static(react-ui/build)` serves assets
  - `GET /api/*` returns JSON 404 (must not fall back to HTML)
  - `GET *` serves `react-ui/build/index.html` for all non-API routes
- Avoid adding redirects/fallback logic that breaks `/api/*` behavior.

### Quick sanity check

- Click into the new page from the header.
- Refresh the page on its URL and confirm it loads.

## Done when

- Route works via clicks and refresh.
- Navigation behaves consistently.
- Styling matches the rest of the app.

