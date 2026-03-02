# Slatepedia

A wiki for *The Legend of Zelda: Breath of the Wild*, covering materials, recipes, armor, food, monsters, shields, weapons, and bows. Browse items with grid/list views, search, filter, and view detailed stats.

**Live demo:** https://slatepedia.herokuapp.com/

---

## What the Project Does

Slatepedia is a fan-made reference site for BOTW that includes:

- **Materials** — Ingredients (fruit, mushrooms, vegetables, fish, shellfish), gems, monster parts, and more
- **Recipes** — Cooked dishes with ingredients and effects
- **Armor** — Body, head, and leg armor with upgrade paths
- **Food** — Cooked and raw food items
- **Monsters** — Enemy types and drops
- **Weapons, Bows & Shields** — Combat gear with durability and stats

The app provides list and grid views with filtering, sorting, and detail pages for each item. Sprite sheets power icons for weapons, armor, monsters, food, and materials.

---

## Tech Stack

| Layer | Tools |
|-------|--------|
| **Backend** | Node.js, Express |
| **Frontend** | React (create-react-app), React Router |
| **UI** | Bootstrap 4, Font Awesome |
| **Data** | Static JSON files in `server/rest/` |

---

## Running Locally

The app has two parts: a Node API server and a React UI. Run both for full functionality.

### Prerequisites

- Node.js (v14+ recommended; the project may use `engines.node` from `package.json`)
- npm

### 1. API server

From the project root:

```bash
npm install
npm start
```

This starts the API on **http://localhost:3001**.

### 2. React UI

In a separate terminal:

```bash
cd react-ui/
npm install
npm start
```

This starts the UI on **http://localhost:3000** and proxies API requests to the Node server.

### Install dependencies

- **Server:** `npm install package-name --save` (at project root)
- **React UI:** `cd react-ui/ && npm install package-name --save`

---

## Deployment

The app is currently set up for Heroku (`heroku-postbuild` builds the React app). For future hosting, it can be adapted for other platforms.

### Future hosting (e.g. Render)

Planned deployment target: **Render**. Suggested setup:

- **Web Service** for the Node server
- Build command: `npm install && cd react-ui/ && npm install && npm run build`
- Start command: `npm start`
- Ensure the built React app is served from `react-ui/build/` (already configured in `server/index.js`)

Render will use the Node buildpack. Environment variables and production ports are handled via `process.env.PORT`.

---

## Project structure

```
slatepedia/
├── server/           # Express API, serves react-ui/build in production
│   ├── rest/         # JSON data (materials, recipes, armor, food, etc.)
│   └── index.js      # App entry, API routes, static files
├── react-ui/         # Create React App frontend
│   └── src/
│       ├── Materials/
│       ├── Recipes/
│       ├── Armor/
│       ├── Food/
│       ├── Monsters/
│       ├── Weapons/
│       ├── Bows/
│       └── Shields/
└── package.json      # Root package (server + build hooks)
```

---

## License

MIT
