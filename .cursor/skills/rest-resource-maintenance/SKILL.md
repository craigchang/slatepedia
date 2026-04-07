---
name: rest-resource-maintenance
description: Add or maintain a REST resource under server/rest and wire it end-to-end (server, OpenAPI, UI)
---

# REST resource maintenance (Slatepedia)

## Use when

- Adding a new category/resource under `server/rest/<resource>/`
- Changing list/detail behavior (fields, filtering, sorting, IDs)
- Adding or changing query parameters (e.g. Animals-style filters)

## Goal

Keep the REST resource consistent across:

- `server/rest/<resource>/` module + data
- Express route wiring in `server/index.js`
- OpenAPI documentation in `server/openapi.yaml`
- React UI pages and navigation (when user-facing)

## Checklist

### Server module (`server/rest/<resource>/`)

- Create/modify `server/rest/<resource>/data.js`
  - Export a stable array of objects (preserve IDs if they exist).
  - Keep field names consistent with the rest of the API (camelCase where already used).
- Create/modify `server/rest/<resource>/index.js`
  - Typical pattern is `module.exports = require('./data')` (see `server/rest/changelog/index.js`).
  - If your resource needs helpers (e.g. Animals filters), export an object with both the helpers and the raw array (see `server/rest/animals/index.js`).
  - If you need computed indexes (by id/name), build them once and keep behavior deterministic.

### Express routing (`server/index.js`)

- Add/modify routes under `/api/<resource>`
  - **List** route: `GET /api/<resource>` returns an array.
  - **Detail** route: current convention is 1-based IDs mapped to array index: `res.send(resourceJson[Number(req.params.id) - 1])`.
- If you add any new API route(s), keep the server’s routing guardrails intact:
  - unknown API paths must return JSON 404 via `GET /api/*`
  - non-API paths should fall through to the React catch-all `GET *` that serves `react-ui/build/index.html`
- If filters are supported:
  - Use query parameters.
  - Follow Animals’ precedent: support **comma-separated** values and **repeated params**, normalize by trimming and lowercasing.

### OpenAPI (`server/openapi.yaml`)

- Add a new tag if this is a new resource.
- Add paths for list and detail endpoints.
- Document query parameters (name, type, format, example).
- Align response schema to the *actual JSON shape* (fields, types, required/optional).
- Update `info.description` “Resources” list if this adds/changes a public resource.

### React UI (if user-facing)

- Add list/detail pages (match existing resource screens for structure and Bootstrap 5 usage).
- Add routes in `react-ui/src/Main.js` with **detail routes before list routes** (as current `Main.js` does).
- Add navigation link in `react-ui/src/Header/Header.js` when appropriate:
  - Resource pages live under the **Resources dropdown** driven by the `RESOURCE_LINKS` array.
- Ensure deep-link loads work on deploy:
  - This project already relies on the Express catch-all `GET *` to serve the React app for non-API paths. Avoid adding redirects that break `/api/*`.

## Done when

- `/api/<resource>` and `/api/<resource>/:id` behave correctly locally.
- `server/openapi.yaml` matches the new/updated response shape.
- UI routes render without console errors (if user-facing).

