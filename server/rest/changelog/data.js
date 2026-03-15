module.exports = [
  {
    "sha": "unreleased",
    "shortSha": "unreleased",
    "htmlUrl": "",
    "date": "2026-02-27T00:00:00Z",
    "title": "Swagger (OpenAPI) docs, CORS, and API description on landing",
    "message": "Adds interactive Swagger UI for the REST API at /api-docs. New OpenAPI 3.0 spec (server/openapi.yaml) documents all endpoints: API root, changelog, and list/detail for materials, recipes, armor, food, monsters, shields, weapons, bows, animals, and other; GET /animals documents query parameters uniqueCookingEffect, commonLocation, recoverableMaterial with examples. Long description in the spec summarizes each resource and how to use Try it out. Servers list uses production URL (Render). Express serves the spec at /api-docs/openapi.yaml and mounts swagger-ui-express at /api-docs. Enables CORS (cors package) so API and docs can be called from other origins. App.js: adds a paragraph on the landing page describing the Swagger docs and linking to /api-docs. Prettifies server/rest/other/data.js (one property per line, consistent indentation)."
  },
  {
    "sha": "unreleased",
    "shortSha": "unreleased",
    "htmlUrl": "",
    "date": "2026-02-27T00:00:00Z",
    "title": "Bootstrap 5 upgrade, search/filter UI, and Animals filters",
    "message": "Upgrades Bootstrap from 4.x to 5.3.3. Migrates markup and styles: data-bs-toggle/data-bs-target, ml/mr to me/ms, custom-select to form-select, sr-only to visually-hidden, navbar container-fluid and data-bs-theme; drops input-group-prepend/append in favor of direct children; form-row to row with g-2. Navbar and landing: proper padding via container-fluid px-3/px-md-4 in header, body padding-top 56px for fixed navbar, main padding 1rem/1.5rem 2rem; landing (App) uses Bootstrap 5–style bg-light rounded-3 section instead of jumbotron. Search and filter UI: search/sort in a card; Grid/List view toggle on its own row (full-width on mobile via dataview-view-toggle CSS); consistent 0.875rem font in SearchFilterCriteria and DataView form; API filter dropdowns use data-bs-auto-close=\"outside\" so they stay open while selecting; Clear filters button always rendered (visibility hidden when inactive) and dropdown-menu-start plus min-width on filter buttons so the dropdown menu does not shift when selections change. Animals: adds Common Locations and Recoverable Materials multi-select filters using existing API query params (commonLocation, recoverableMaterial). List view: icon fixed to the left of body content via flex layout on .media (Bootstrap 5 no longer provides .media). HealthBar: sr-only to visually-hidden."
  },
  {
    "sha": "unreleased",
    "shortSha": "unreleased",
    "htmlUrl": "",
    "date": "2026-03-15T00:00:00Z",
    "title": "Other Items resource, monster item drops, and nav",
    "message": "Adds an Other Items resource for miscellaneous in-game items (rupees, key items, bridles/saddles, compendium icons, etc.). New REST API: GET /api/other and GET /api/other/:id; data includes id, name, cssClassName, and in-game descriptions (rupees use official BotW text). New React list (OtherItems) and detail (OtherItemDetail) pages with sprites from materials.png via OtherItemsSprites.css; routes /other and /other/:id; Other added to Resources dropdown in the header. IconContainer and grid/list image views support spriteSheet \"other\". MonstersDetail shows Other Items sprites in Item Drops, imports OtherItemsSprites.css, and uses correct category and id per drop: rupees and Master Cycle Zero use category \"other\" with ids from other/data.js; cooked food (Roasted Bass, Seared Steak, etc.) use category \"food\"; generic Bow and Weapons use \"bows\" and \"weapons\". Monster rupee drop ids fixed (e.g. Green 1, Blue 2, Red 5, Purple 4); Master Cycle Zero id set to 30. WeaponsDetail: add map-marker icon to Availabilities list for consistency."
  },
  {
    "sha": "unreleased",
    "shortSha": "unreleased",
    "htmlUrl": "",
    "date": "2026-02-27T00:00:00Z",
    "title": "Add BonusEffect component",
    "message": "Adds shared BonusEffect component that maps bonus effect names (e.g. Attack Up, Defense Up, Stealth Up) to icons. Used in list and grid item views for food, armor, and other items with bonus effects."
  },
  {
    "sha": "b0dd412649c253dd21f4821450c45ea6378e6c71",
    "shortSha": "b0dd412",
    "htmlUrl": "https://github.com/craigchang/slatepedia/commit/b0dd412649c253dd21f4821450c45ea6378e6c71",
    "date": "2026-03-11T07:11:21Z",
    "title": "Staged changes (for commit)",
    "message": "Adds a static snapshot of the latest GitHub commits (sha/shortSha, date, title, full message, and direct GitHub htmlUrl).\nAdds GET /api/changelog to serve the static changelog snapshot.\nAdds an /api/* JSON 404 handler so unknown API routes don’t fall back to index.html.\nFetches changelog entries from /api/changelog and renders them.\nLinks each entry to the exact GitHub commit URL.\nShows title + message, but strips the duplicated title line from the message body."
  },
  {
    "sha": "3673e2c16ca99ac4052f8937338835a247894eaa",
    "shortSha": "3673e2c",
    "htmlUrl": "https://github.com/craigchang/slatepedia/commit/3673e2c16ca99ac4052f8937338835a247894eaa",
    "date": "2026-03-11T06:50:42Z",
    "title": "update buildCommand",
    "message": ""
  },
  {
    "sha": "613fc0cfd6756ba1d157f163774ad923d5b1d788",
    "shortSha": "613fc0c",
    "htmlUrl": "https://github.com/craigchang/slatepedia/commit/613fc0cfd6756ba1d157f163774ad923d5b1d788",
    "date": "2026-03-11T06:43:21Z",
    "title": "create a _redirects file under public/ so changelog url is served by index.html",
    "message": ""
  },
  {
    "sha": "e3ce03e757ebe720fc48a76ecacf665e65c6a93d",
    "shortSha": "e3ce03e",
    "htmlUrl": "https://github.com/craigchang/slatepedia/commit/e3ce03e757ebe720fc48a76ecacf665e65c6a93d",
    "date": "2026-03-11T06:36:50Z",
    "title": "Fix changelog routing for client-side navigation",
    "message": "- Make the home route () exact so it doesn’t match and swallow\n- Ensures React Router can render the changelog page when the host rewrites requests to"
  },
  {
    "sha": "3535d8e03aa4be03bededefe6adc30b10ce90e63",
    "shortSha": "3535d8e",
    "htmlUrl": "https://github.com/craigchang/slatepedia/commit/3535d8e03aa4be03bededefe6adc30b10ce90e63",
    "date": "2026-03-11T06:30:46Z",
    "title": "add missing Changelog files",
    "message": ""
  },
  {
    "sha": "82e0a6f20907ae9a55e3ff1dccd1917a5c244779",
    "shortSha": "82e0a6f",
    "htmlUrl": "https://github.com/craigchang/slatepedia/commit/82e0a6f20907ae9a55e3ff1dccd1917a5c244779",
    "date": "2026-03-10T03:30:56Z",
    "title": "Add changelog feature",
    "message": "- Add /api/commits endpoint to proxy GitHub API (craigchang/slatepedia)\n- Add Changelog route and enable it in Main.js\n- Add Changelog link to header (right-aligned)\n- Add continuous-updates copy and changelog link on home page"
  },
  {
    "sha": "127c4289eb91a71a7662ab62b9e66b1c10bcca2d",
    "shortSha": "127c428",
    "htmlUrl": "https://github.com/craigchang/slatepedia/commit/127c4289eb91a71a7662ab62b9e66b1c10bcca2d",
    "date": "2026-03-09T04:20:46Z",
    "title": "Add footer and loading widget",
    "message": "- Add footer with MIT license and fair use disclaimer\n- Add Loading component and show it while fetching list data (Materials, Monsters, Animals, Recipes, Armor, Food, Shields, Weapons, Bows)"
  },
  {
    "sha": "b10f5f969fb29bf40af8452c6cb15833c8fde3b8",
    "shortSha": "b10f5f9",
    "htmlUrl": "https://github.com/craigchang/slatepedia/commit/b10f5f969fb29bf40af8452c6cb15833c8fde3b8",
    "date": "2026-03-08T21:26:38Z",
    "title": "Fix Stealthfin Trout uniqueCookingEffects: use \"Stealth Up\" instead of \"Stealth\"",
    "message": ""
  },
  {
    "sha": "591e356825eb224ea36e314e4ffdfcd3819c9766",
    "shortSha": "591e356",
    "htmlUrl": "https://github.com/craigchang/slatepedia/commit/591e356825eb224ea36e314e4ffdfcd3819c9766",
    "date": "2026-03-08T08:10:20Z",
    "title": "update descriptions",
    "message": ""
  },
  {
    "sha": "01b5a9dd7fd632d9a39b44d8fd22e1cb7350ea8b",
    "shortSha": "01b5a9d",
    "htmlUrl": "https://github.com/craigchang/slatepedia/commit/01b5a9dd7fd632d9a39b44d8fd22e1cb7350ea8b",
    "date": "2026-03-08T05:41:45Z",
    "title": "lots of fixes",
    "message": ""
  },
  {
    "sha": "6d49fba67d097a64244df381acf40830b8680779",
    "shortSha": "6d49fba",
    "htmlUrl": "https://github.com/craigchang/slatepedia/commit/6d49fba67d097a64244df381acf40830b8680779",
    "date": "2026-03-07T07:17:03Z",
    "title": "update readme",
    "message": ""
  },
  {
    "sha": "6adaff042a03ac3fd9f3869c3afd0ef51728219b",
    "shortSha": "6adaff0",
    "htmlUrl": "https://github.com/craigchang/slatepedia/commit/6adaff042a03ac3fd9f3869c3afd0ef51728219b",
    "date": "2026-03-05T06:23:43Z",
    "title": "added animals section, still work in progress",
    "message": ""
  },
  {
    "sha": "aabac355299a3b18c3277ac07118595382671ef5",
    "shortSha": "aabac35",
    "htmlUrl": "https://github.com/craigchang/slatepedia/commit/aabac355299a3b18c3277ac07118595382671ef5",
    "date": "2026-03-02T17:31:20Z",
    "title": "update readme",
    "message": ""
  },
  {
    "sha": "f726fe42da364efc2f97c71f383dc9c3d1075fc7",
    "shortSha": "f726fe4",
    "htmlUrl": "https://github.com/craigchang/slatepedia/commit/f726fe42da364efc2f97c71f383dc9c3d1075fc7",
    "date": "2026-03-02T17:30:05Z",
    "title": "new site url",
    "message": ""
  },
  {
    "sha": "e99d12f975061fab2c8fba04f559cec8da5fef59",
    "shortSha": "e99d12f",
    "htmlUrl": "https://github.com/craigchang/slatepedia/commit/e99d12f975061fab2c8fba04f559cec8da5fef59",
    "date": "2026-03-02T06:06:59Z",
    "title": "remove heroku config",
    "message": ""
  },
  {
    "sha": "2d2016ce7964dbd8177fedea31637657397bdcc2",
    "shortSha": "2d2016c",
    "htmlUrl": "https://github.com/craigchang/slatepedia/commit/2d2016ce7964dbd8177fedea31637657397bdcc2",
    "date": "2026-03-02T06:02:52Z",
    "title": "server only",
    "message": ""
  },
  {
    "sha": "dcca40cec08b87ded668f0913a801beaa2bd7a18",
    "shortSha": "dcca40c",
    "htmlUrl": "https://github.com/craigchang/slatepedia/commit/dcca40cec08b87ded668f0913a801beaa2bd7a18",
    "date": "2026-03-02T06:00:24Z",
    "title": "increase memory",
    "message": ""
  },
  {
    "sha": "0ff07600e6cbc24a763a60adb06ca5932713f1a2",
    "shortSha": "0ff0760",
    "htmlUrl": "https://github.com/craigchang/slatepedia/commit/0ff07600e6cbc24a763a60adb06ca5932713f1a2",
    "date": "2026-03-02T05:39:28Z",
    "title": "render file",
    "message": ""
  },
  {
    "sha": "a10279d6b7862050b292fd7145d0860f4eb20c04",
    "shortSha": "a10279d",
    "htmlUrl": "https://github.com/craigchang/slatepedia/commit/a10279d6b7862050b292fd7145d0860f4eb20c04",
    "date": "2026-03-02T05:35:23Z",
    "title": "replace img with background images",
    "message": ""
  },
  {
    "sha": "390e00d8149515be48ad80ae52c6405cc41f4723",
    "shortSha": "390e00d",
    "htmlUrl": "https://github.com/craigchang/slatepedia/commit/390e00d8149515be48ad80ae52c6405cc41f4723",
    "date": "2026-02-28T07:11:24Z",
    "title": "fix npm vulnerabilities",
    "message": ""
  }
];

