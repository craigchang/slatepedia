## Cursor hooks (via npm scripts)

This repo uses simple `npm` scripts as “hook-like” checks you can run before committing or opening a PR.

### Run all checks

```bash
npm run check:all
```

### Individual checks

- `npm run check:no-generated-changes`
  - Fails if you modified build artifacts or dependencies (`react-ui/build`, `node_modules`).
- `npm run check:changelog`
  - Validates `server/rest/changelog/data.js` schema and version ordering.
- `npm run check:openapi-min`
  - Minimal sanity checks on `server/openapi.yaml` (header + required sections).
- `npm run check:openapi-drift`
  - Heuristic: if API code changed (`server/index.js` or `server/rest/**`) but `server/openapi.yaml` didn’t, fail.

### Notes

- These checks run on Node (project requires Node `>=22`).
- If you want these to run automatically, wire `npm run check:all` into a Git pre-commit hook or your CI.

