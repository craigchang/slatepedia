## Server data maintenance (`server/rest/**/data.js`)

These files are large, curated static datasets. Small edits can have large downstream effects.

### Key constraints

- **Avoid reordering** arrays unless explicitly intended.
  - Many detail endpoints map `:id` to array index using 1-based indexing (`Number(id) - 1`).
- Prefer **minimal diffs**:
  - don’t reformat entire files
  - avoid accidental whitespace churn

### Editing guidance

- When fixing strings used for filters (effects, locations, types):
  - keep naming consistent with existing values
  - avoid creating near-duplicates that split results (e.g. “Stealth” vs “Stealth Up”)
- When adding fields:
  - keep the field name consistent with similar resources
  - consider whether the UI and OpenAPI need updates

### Spot-check after edits

- Validate at least one edited object visually.
- Confirm list endpoint still returns expected results for the edited category.
- If filters exist for the resource, sanity-check at least one filter query.

