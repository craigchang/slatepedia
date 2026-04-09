## API conventions

### Resource module pattern

Resources live under:

- `server/rest/<resource>/data.js` (static array of objects)
- `server/rest/<resource>/index.js` (exports data and/or helpers)

Common export styles:

- Simple resources: `module.exports = require('./data')`
- Resources with helpers: export an object containing helpers + raw array (see Animals).

### Endpoints

Most resources expose:

- `GET /api/<resource>` → array
- `GET /api/<resource>/:id` → object (1-based `id`, mapped as `Number(id) - 1`)

### Filtering (Animals precedent)

If a list endpoint supports filters:

- Use query parameters.
- Support **comma-separated** values and **repeated params**.
- Normalize terms by trimming and lowercasing.
- Prefer partial matching for free-text filters (e.g. `includes(term)`), unless the resource requires exact matching.

### Errors

- Unknown API routes return JSON 404 from `GET /api/*` (do not serve the React app for `/api/...`).

