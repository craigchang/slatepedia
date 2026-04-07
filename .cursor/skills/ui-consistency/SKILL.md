---
name: ui-consistency
description: Keep new UI features consistent with Bootstrap 5, existing components, and mobile/nav behavior
---

# UI Consistency

## Use when

- Adding a new list/grid/detail view
- Adding search/filter controls
- Adjusting layout, spacing, icons, or typography

## Goal

Make new UI feel like it belongs in Slatepedia by reusing existing components and styles and by matching responsive behavior.

## Checklist

### Reuse shared components first

- Look for a matching building block under `react-ui/src/CommonComponents/`:
  - list rows and image rendering
  - generic data views / detail formatting
- Only create a new one if the existing components can’t be adapted cleanly.

### Match existing styling conventions

- Prefer Bootstrap 5 classes for layout (`container`, `row`, `col`, `gap-*`, `mt-*`, etc.).
- Use existing CSS patterns in `react-ui/src/index.css` and nearby component CSS.
- Keep typography consistent (heading sizes, muted helper text, spacing).

### Filters/search UX

- Align filter bar layout with other pages (grouping, labels, spacing).
- Ensure filters are easy to clear/reset.
- Keep query parameter naming consistent with the server and OpenAPI docs.

### Mobile + navigation behavior

- Check that the page behaves well at narrow widths:
  - nav doesn’t overflow unexpectedly
  - list rows wrap gracefully
  - controls remain tappable
- If a page is added to nav, ensure active state behavior matches existing links.

## Done when

- New screens look and behave like sibling screens.
- Shared components are reused instead of duplicated.
- Filters/search feel consistent and are usable on mobile.

