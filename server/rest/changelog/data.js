/**
 * User-facing changelog copy only: avoid file paths, module names, and source layout in `message`
 * so the site does not read like an internal repo dump.
 *
 * Each entry has a semantic `version` (major.minor.build). Display order in the app is newest-first;
 * versions were assigned oldest-first starting at 0.0.0.
 */
module.exports = [
  {
    "version": "0.6.0",
    "date": "2026-02-27T00:00:00Z",
    "title": "Development roadmap page and landing copy",
    "message": "New Development roadmap page at /roadmap with Next and Future plans (field filtering per resource; Tears of the Kingdom content considered). Roadmap linked from the header and the home page."
  },
  {
    "version": "0.5.0",
    "date": "2026-02-27T00:00:00Z",
    "title": "Swagger (OpenAPI) docs, CORS, and API description on landing",
    "message": "Interactive Swagger (OpenAPI) documentation at /api-docs for all public API endpoints, including animals list filters. Cross-origin access enabled so you can try requests from the docs. Home page links to the API docs. Other items data reformatted for readability."
  },
  {
    "version": "0.4.0",
    "date": "2026-02-27T00:00:00Z",
    "title": "Bootstrap 5 upgrade, search/filter UI, and Animals filters",
    "message": "Upgraded to Bootstrap 5 with updated navigation, forms, and layout. Improved search and filter bar (including animals: common locations and recoverable materials). List view shows icons to the left of each row again. Refined landing page spacing and mobile behavior."
  },
  {
    "version": "0.3.0",
    "date": "2026-03-15T00:00:00Z",
    "title": "Other Items resource, monster item drops, and nav",
    "message": "New Other category for miscellaneous items (rupees, key items, bridles, saddles, compendium icons, etc.) with list and detail pages and API support. Monster item drops and links updated so rupees, food, weapons, and other drops point to the right categories. Small consistency tweak on weapon availability display."
  },
  {
    "version": "0.2.0",
    "date": "2026-02-27T00:00:00Z",
    "title": "Add BonusEffect component",
    "message": "Bonus effect names (such as Attack Up, Defense Up, Stealth Up) now show with matching icons in list and grid views for food, armor, and similar items."
  },
  {
    "version": "0.1.5",
    "date": "2026-03-11T07:11:21Z",
    "title": "Staged changes (for commit)",
    "message": "Changelog is served from a static snapshot with semantic version labels. Unknown API paths return JSON errors instead of the app shell."
  },
  {
    "version": "0.1.4",
    "date": "2026-03-11T06:50:42Z",
    "title": "update buildCommand",
    "message": ""
  },
  {
    "version": "0.1.3",
    "date": "2026-03-11T06:43:21Z",
    "title": "create a _redirects file under public/ so changelog url is served by index.html",
    "message": ""
  },
  {
    "version": "0.1.2",
    "date": "2026-03-11T06:36:50Z",
    "title": "Fix changelog routing for client-side navigation",
    "message": "Routing fix so the changelog page loads correctly when the host sends all paths to the app."
  },
  {
    "version": "0.1.1",
    "date": "2026-03-11T06:30:46Z",
    "title": "add missing Changelog files",
    "message": ""
  },
  {
    "version": "0.1.0",
    "date": "2026-03-10T03:30:56Z",
    "title": "Add changelog feature",
    "message": "Changelog page and navigation link. Home page mentions ongoing updates and links to the changelog. Changelog entries are available as JSON from the API."
  },
  {
    "version": "0.0.13",
    "date": "2026-03-09T04:20:46Z",
    "title": "Add footer and loading widget",
    "message": "Footer with license and fair-use note. Loading indicator while category lists load."
  },
  {
    "version": "0.0.12",
    "date": "2026-03-08T21:26:38Z",
    "title": "Fix Stealthfin Trout uniqueCookingEffects: use \"Stealth Up\" instead of \"Stealth\"",
    "message": ""
  },
  {
    "version": "0.0.11",
    "date": "2026-03-08T08:10:20Z",
    "title": "update descriptions",
    "message": ""
  },
  {
    "version": "0.0.10",
    "date": "2026-03-08T05:41:45Z",
    "title": "lots of fixes",
    "message": ""
  },
  {
    "version": "0.0.9",
    "date": "2026-03-07T07:17:03Z",
    "title": "update readme",
    "message": ""
  },
  {
    "version": "0.0.8",
    "date": "2026-03-05T06:23:43Z",
    "title": "added animals section, still work in progress",
    "message": ""
  },
  {
    "version": "0.0.7",
    "date": "2026-03-02T17:31:20Z",
    "title": "update readme",
    "message": ""
  },
  {
    "version": "0.0.6",
    "date": "2026-03-02T17:30:05Z",
    "title": "new site url",
    "message": ""
  },
  {
    "version": "0.0.5",
    "date": "2026-03-02T06:06:59Z",
    "title": "remove heroku config",
    "message": ""
  },
  {
    "version": "0.0.4",
    "date": "2026-03-02T06:02:52Z",
    "title": "server only",
    "message": ""
  },
  {
    "version": "0.0.3",
    "date": "2026-03-02T06:00:24Z",
    "title": "increase memory",
    "message": ""
  },
  {
    "version": "0.0.2",
    "date": "2026-03-02T05:39:28Z",
    "title": "render file",
    "message": ""
  },
  {
    "version": "0.0.1",
    "date": "2026-03-02T05:35:23Z",
    "title": "replace img with background images",
    "message": ""
  },
  {
    "version": "0.0.0",
    "date": "2026-02-28T07:11:24Z",
    "title": "fix npm vulnerabilities",
    "message": ""
  }
];
