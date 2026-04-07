---
name: changelog-maintenance
description: Maintain changelog data + UI (semantic versions, copy rules, schema parity with OpenAPI)
---

# Changelog maintenance

## Use when

- Editing `server/rest/changelog/data.js`
- Editing the Changelog UI under `react-ui/src/Changelog/`
- Changing changelog API shape or display conventions

## Changelog entry schema (current)

- `version`: string (`major.minor.build`)
- `date`: ISO date-time string
- `title`: short title
- `message`: user-facing detail text

## Versioning rules

- Versions are assigned **oldest → newest**, starting at **`0.0.0`** for the oldest entry.
- Default progression is **increment build** for each subsequent entry.
- For milestone entries, **increment minor** and **reset build to 0**.
- Milestone bumps should be explicitly reflected in the data (do not infer them in the UI).

## Copy rules (important)

- `message` is user-facing: avoid file paths, internal module names, and “repo dump” language.
- Do not include GitHub commit links or SHAs in changelog data.
- Keep `title` and `message` short and scannable; prefer plain language over implementation detail.

## Checklist

### Data changes (`server/rest/changelog/data.js`)

- Add/update entry fields: `version`, `date`, `title`, `message`.
- Preserve display ordering expected by the UI (newest-first in the exported array, if that’s the current convention).
- Ensure version scheme remains consistent and documented in the file header comment.

### UI changes (`react-ui/src/Changelog/`)

- Changelog list header should display `v{version}`.
- Keys for list rendering should use `version` (or a stable fallback).
- Keep styling consistent (Bootstrap list-group, consistent typography).

### OpenAPI parity (`server/openapi.yaml`)

- If changelog fields change, update:
  - `/changelog` operation description
  - response schema `items.properties`
  - examples if helpful

## Done when

- `/api/changelog` returns the documented schema.
- The Changelog page renders versions (no broken links / missing fields).
- `server/openapi.yaml` matches the runtime shape.

