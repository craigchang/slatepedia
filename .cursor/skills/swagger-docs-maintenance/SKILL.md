---
name: swagger-documentation-maintenance
description: Keep server/openapi.yaml accurate when API routes, params, or response shapes change
---

# Swagger (OpenAPI) documentation maintenance

## Use when

- Any `/api/*` route changes (new endpoint, removed endpoint, changed behavior)
- Any query parameter changes (new filters, changed parsing, changed multi-value behavior)
- Any response shape changes (field names/types, required vs optional, examples)

## Goal

Ensure `server/openapi.yaml` remains a trustworthy contract and the Swagger UI reflects reality.

## Checklist

### Identify what changed

- Which Express route(s) were added/changed? (e.g. `GET /api/animals`)
- Which request inputs changed?
  - Path params (e.g. `:id`)
  - Query params (types, allowed values, multi-value behavior)
- Which response outputs changed?
  - Object fields (added/removed/renamed)
  - Types (string/number/array/object)
  - Empty/null behavior

### Update `server/openapi.yaml`

- **Paths**
  - Add/modify the operation under the correct path (`/materials`, `/animals`, etc. — these are relative to the `/api` server prefix configured in `servers`).
  - Ensure `operationId` is unique and stable.
- **Tags**
  - Put the operation under an existing resource tag or add a new tag for a new resource.
- **Parameters**
  - Define each query parameter explicitly (name, `in: query`, schema type, examples).
  - If multi-value is supported, document the exact behavior:
    - Animals-style: comma-separated values **or** repeated query params, case-insensitive matching
- **Responses**
  - Update the `200` schema to match the actual JSON:
    - list endpoints: `type: array`
    - detail endpoints: `type: object`
  - Keep error shapes consistent with the server’s real JSON error responses (if documented elsewhere).
- **Examples**
  - Add short examples for new fields or new endpoints to reduce ambiguity.

### Verify Swagger UI paths

- This project serves Swagger UI at `/api-docs` and the spec at `/api-docs/openapi.yaml`.
- Ensure new/changed endpoints render correctly in Swagger UI and “Try it out” uses the correct server base (`/api`).

### Keep the “Resources” story accurate

- If a new resource becomes public, update the “Resources” list in `info.description`.
- If a resource gets meaningful new filters/capabilities, update its bullet so the landing docs stay honest.

## Done when

- A developer can read `server/openapi.yaml` and correctly understand inputs/outputs for changed endpoints.
- Swagger UI can “Try it out” successfully against the running server for the modified endpoints.

