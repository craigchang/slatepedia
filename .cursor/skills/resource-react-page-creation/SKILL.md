---
name: resource-react-page-creation
description: Create React UI pages for a new server/rest resource (list/detail routes, component folder, styling, tests)
---

# Resource React Page Creation

## Use when

- A new REST resource is introduced under `server/rest/<resource>/` and needs a UI
- Existing resource UI needs to be added or expanded (list + detail patterns)

## Goal

Add a consistent UI implementation for the resource that matches Slatepedia patterns and integrates cleanly with routing and navigation.

## Checklist

### Confirm server API shape first

- Know the list endpoint and detail endpoint:
  - `GET /api/<resource>` (array)
  - `GET /api/<resource>/:id` (object)
- Confirm identifying fields used in UI (id, name, image/icon fields, etc.).
- If filters exist, confirm query parameter names and expected values.

### Create React folders/components

- Create `react-ui/src/<ResourceName>/` (match naming conventions used by existing resources)
  - `<ResourceName>.js` (list page)
  - `<ResourceName>.css` (optional)
  - `<ResourceName>.test.js` (optional, follow existing lightweight test style)
- Create `react-ui/src/<ResourceName>Detail/`
  - `<ResourceName>Detail.js`
  - `<ResourceName>Detail.css` (optional)
  - `<ResourceName>Detail.test.js` (optional)
- Naming convention in this repo is mixed but predictable:
  - Resource list components use plural resource names (e.g. `Materials/Materials.js`, `Weapons/Weapons.js`)
  - Detail components usually use `<Resource>Detail` folder names (e.g. `WeaponsDetail/WeaponsDetail.js`)
  - Match the pattern used by the closest existing resource rather than inventing a new one.

### Reuse shared UI patterns

- Prefer `react-ui/src/CommonComponents/` for:
  - list rows / list images
  - grid/list toggles if present
  - shared data views
- Keep Bootstrap 5 layout consistent with similar pages (spacing, cards, list-group, etc.).

### Wire routes

- Add new routes in `react-ui/src/Main.js`
  - List route (e.g. `/weapons`)
  - Detail route (e.g. `/weapons/:id`)
- Ensure route order doesn’t shadow other routes:
  - put `/resource/:id` **before** `/resource` (this is how `Main.js` is currently structured)

### Add nav entry (if appropriate)

- Add resource link in `react-ui/src/Header/Header.js`.
- Keep ordering consistent with the other encyclopedia sections.
- Resources appear in the Resources dropdown via the `RESOURCE_LINKS` array.

### Data fetching conventions

- Use `fetch('/api/<resource>')` and `fetch('/api/<resource>/:id')` patterns consistent with existing pages.
- Handle loading and “not found” states similarly to other resource pages.
- Server convention for IDs is 1-based indexing into arrays (`Number(id) - 1`); UI should treat route `:id` as that same ID.

## Done when

- List loads and renders with stable keys and consistent layout.
- Detail page loads from list clicks and direct URL entry.
- UI uses shared components where it reduces duplication.

