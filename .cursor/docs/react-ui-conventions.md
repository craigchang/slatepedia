## React UI conventions (Create React App)

### Routing

Routes are defined in `react-ui/src/Main.js` using `react-router-dom`.

Conventions:

- Put **detail** routes before **list** routes:
  - `/resource/:id` before `/resource`
- The `Main` layout wraps routes with `<Header/>` and `<Footer/>`, so page components should render only the page body.

### Navigation

Header is `react-ui/src/Header/Header.js`.

- Encyclopedia resources live under the **Resources dropdown**, driven by the `RESOURCE_LINKS` array.
- Top-level non-resource pages (e.g. Roadmap) are linked on the right side of the navbar.

### Styling

- Bootstrap 5 is used heavily; match nearby pages for spacing and component choices.
- Prefer reusing `react-ui/src/CommonComponents/` before creating new UI primitives.

### API calls

- Fetch from `/api/<resource>` paths (relative URLs), consistent with existing pages.

