---
name: server-data-maintenance
description: Safely edit large static data files under server/rest/**/data.js with minimal risk
---

# Server Data Maintenance

## Use when

- Touching any `server/rest/**/data.js` file (e.g. `armor/data.js`, `animals/data.js`)
- Fixing typos, normalizing strings, adding a field, correcting a value
- Bulk edits that could accidentally reorder or change IDs

## Goal

Make correct, minimal diffs while preserving stability for:

- existing IDs and any implicit ordering expectations
- UI assumptions (filters, display strings, icons)
- API consumers

## Checklist

### Before editing

- Identify the **primary key** used by the API/UI (often numeric `id` derived from array index or an explicit `id` field).
- Determine whether ordering is relied upon (many projects implicitly rely on stable ordering for IDs).

### While editing

- Prefer minimal diffs:
  - change only the intended entries/fields
  - avoid reformatting or reordering large blocks
- Preserve stable IDs / array structure unless the task explicitly requires a reorder.
- If normalizing strings (effects, locations, types):
  - keep values consistent with filters and UI label matching
  - avoid introducing near-duplicates (e.g. \"Stealth\" vs \"Stealth Up\")

### Spot-check

- Pick one edited object and ensure it still looks correct and complete.
- Verify list endpoint and any relevant filter endpoints still behave as expected (especially when you changed field values used by filters).

## Done when

- Changes are minimal and targeted.
- No unintended reorder/renumber side effects.
- Edited fields still match UI and filtering expectations.

