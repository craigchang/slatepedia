## Architecture overview

### High-level layout

- **Server**: `server/` (Express)
  - Serves the REST API under `/api/*`
  - Serves Swagger UI under `/api-docs`
  - Serves the built React app from `react-ui/build`
- **UI**: `react-ui/` (Create React App)

### Express routing guardrails (important)

The server is intentionally structured so:

- Static assets are served first via `express.static(react-ui/build)`.
- Swagger UI is served at:
  - `/api-docs` (UI)
  - `/api-docs/openapi.yaml` (spec)
- API routes are served under `/api/...`.
- **Unknown API routes must never fall back to HTML**:
  - `GET /api/*` returns JSON 404 (e.g. `{ error: 'Unknown API route' }`)
- All remaining routes fall back to the React SPA:
  - `GET *` serves `react-ui/build/index.html`

### Resource data model + IDs

Most resources are backed by static arrays in `server/rest/<resource>/data.js`.

- Detail endpoints generally treat `:id` as **1-based** and map it to the array via:
  - `resourceJson[Number(req.params.id) - 1]`
- If ordering changes in a data array, IDs can effectively shift. Avoid reordering unless explicitly intended.

