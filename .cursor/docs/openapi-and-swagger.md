## OpenAPI + Swagger UI

### Where it lives

- OpenAPI spec: `server/openapi.yaml`
- Swagger UI: served by the Express app at `/api-docs`
- Spec URL used by UI: `/api-docs/openapi.yaml`

### Keep the spec accurate

When you add/change anything in `/api/*`:

- Update `server/openapi.yaml` paths and operations
- Document query parameters (including multi-value behavior)
- Keep response schemas aligned with actual JSON outputs

### Servers prefix

The OpenAPI `servers` entry uses a base URL of `/api`, so paths in the spec are written without the `/api` prefix (e.g. `/materials`, not `/api/materials`).

### Practical sanity checks

- Ensure the endpoint exists in Express routing.
- Ensure Swagger UI “Try it out” works against the running server for the updated endpoints.

