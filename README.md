# Slatepedia

A wiki for *The Legend of Zelda: Breath of the Wild*, covering materials, recipes, armor, food, monsters, animals, shields, weapons, and bows. Browse items with grid/list views, search, filter, and view detailed stats.

**Live demo:** https://slatepedia.onrender.com/

---

## What the Project Does

Slatepedia is a fan-made reference site for BOTW that includes:

- **Materials** — Ingredients (fruit, mushrooms, vegetables, fish, shellfish), gems, monster parts, and more
- **Recipes** — Cooked dishes with ingredients and effects
- **Armor** — Body, head, and leg armor with upgrade paths
- **Food** — Cooked and raw food items
- **Monsters** — Enemy types and drops
- **Animals** — Creatures (land animals, birds, fish, insects) with in-game descriptions and common locations
- **Weapons, Bows & Shields** — Combat gear with durability and stats

The app provides list and grid views with filtering, sorting, and detail pages for each item. Sprite sheets power icons for weapons, armor, monsters, food, materials, and animals.

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

- Node.js (v22+; see `engines.node` in `package.json`)
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

### Render

The app is hosted on [Render](https://render.com/) at **https://slatepedia.onrender.com/** via a Blueprint (`render.yaml`). The deployment runs **API server only**—no React UI build—to avoid memory limits on the free tier.

- **Build command:** `npm install`
- **Start command:** `npm start`
- **Port:** Uses `process.env.PORT` (set by Render)

To deploy: connect your repo to Render and use the Blueprint. Render will read `render.yaml` and configure the web service.

---

## Project structure

```
slatepedia/
├── server/           # Express API, serves react-ui/build in production
│   ├── rest/         # JSON data (materials, recipes, armor, food, animals, etc.)
│   └── index.js      # App entry, API routes, static files
├── react-ui/         # Create React App frontend
│   └── src/
│       ├── Materials/
│       ├── Recipes/
│       ├── Armor/
│       ├── Food/
│       ├── Monsters/
│       ├── Animals/
│       ├── Weapons/
│       ├── Bows/
│       └── Shields/
└── package.json      # Root package (server + build hooks)
```

---

## License

MIT
