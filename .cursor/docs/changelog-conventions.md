## Changelog conventions

### Data source

- Changelog entries live in `server/rest/changelog/data.js`.
- The API endpoint `GET /api/changelog` returns this static snapshot.

### Schema

Each entry uses:

- `version` (string `major.minor.build`)
- `date` (ISO date-time string)
- `title` (string)
- `message` (string)

### Versioning

- Versions are assigned **oldest → newest** starting at `0.0.0`.
- Default progression is incrementing **build**.
- Certain milestone entries bump **minor** and reset build to `0` (these are encoded in the data, not inferred by the UI).
- Display order in the UI is newest-first.

### Copy guidelines

- Keep `message` user-facing: avoid file paths, internal module names, and repo-internal details.
- Do not use commit SHAs or GitHub links in changelog entries.

### Docs parity

- If the changelog response shape changes, update `server/openapi.yaml` in the same change set.

