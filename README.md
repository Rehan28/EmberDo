# Ember — Discipline Tracker (MERN)

A full-stack rebuild of the single-file Ember tracker: **React (Vite)** frontend, **Node.js/Express** API, **MongoDB** (via Mongoose) for persistence. Same look, same features — daily to-do/not-to-do lists with a points system, weekly & monthly goals, habit tracking with a 365-day heatmap, and folder-organized Markdown notes — now backed by a real database instead of browser storage.

## Project structure

```
ember/
├── backend/                 Express API
│   ├── config/db.js         MongoDB connection
│   ├── models/               Mongoose schemas (DailyData, WeeklyData, MonthlyData, HabitData, NotesData, Meta)
│   ├── routes/                REST endpoints, one file per resource
│   ├── server.js             App entry point
│   └── .env.example
├── frontend/                 React app (Vite)
│   └── src/
│       ├── api.js            Thin fetch wrapper around the backend
│       ├── App.jsx
│       ├── components/       Sidebar, ProgressBar, heatmaps, toast, quote modal
│       ├── tabs/              DailyTab, WeeklyTab, MonthlyTab, HabitsTab, NotesTab
│       ├── utils/             Date + completion-percentage helpers
│       └── data/quotes.js
└── package.json               Root convenience scripts (run both servers together)
```

## How the data maps

The original app kept everything in `window.storage` under a handful of keys (`daily-data`, `weekly-data`, `monthly-data`, `habit-data`, `notes-data`, `meta-data`). Each key now has its own MongoDB collection and REST route, so the shape of the data barely changed — only *where* it lives did:

| Original storage key | Collection      | Endpoint(s) |
|---|---|---|
| `daily-data`   | `dailydatas`   | `GET /api/daily`, `GET/PUT /api/daily/:date` |
| `weekly-data`  | `weeklydatas`  | `GET /api/weekly`, `GET/PUT /api/weekly/:weekStart` |
| `monthly-data` | `monthlydatas` | `GET /api/monthly`, `GET/PUT /api/monthly/:month` |
| `habit-data`   | `habitdatas`   | `GET/PUT /api/habits` (singleton) |
| `notes-data`   | `notesdatas`   | `GET/PUT /api/notes` (singleton) |
| `meta-data`    | `metas`        | `GET/PUT /api/meta` (singleton) |

## Prerequisites

- Node.js 18+
- A MongoDB database — either:
  - **Local:** install MongoDB Community Server and run `mongod`, or
  - **Atlas (free tier):** create a cluster at https://www.mongodb.com/cloud/atlas and copy its connection string

## Setup

1. **Install dependencies** (from the `ember/` root):
   ```bash
   npm run install:all
   ```

2. **Configure the backend.** Copy the example env file and fill in your Mongo URI:
   ```bash
   cd backend
   cp .env.example .env
   ```
   Edit `.env`:
   ```
   MONGODB_URI=mongodb://127.0.0.1:27017/ember
   PORT=5000
   CLIENT_ORIGIN=http://localhost:5173
   ```

3. **Configure the frontend.** Copy its example env file too:
   ```bash
   cd ../frontend
   cp .env.example .env
   ```
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Run both servers** (from the `ember/` root):
   ```bash
   npm run dev
   ```
   This starts the API on `http://localhost:5000` and the React app on `http://localhost:5173`. Open the latter in your browser.

   Or run them separately in two terminals:
   ```bash
   npm run dev --prefix backend
   npm run dev --prefix frontend
   ```

## Building for production

```bash
npm run build:frontend      # outputs frontend/dist
npm run start:backend       # runs the API with `node`, not nodemon
```

Deploy `backend/` to any Node host (Render, Railway, Fly.io, a VPS, etc.) with `MONGODB_URI` and `CLIENT_ORIGIN` set to your deployed frontend's URL. Deploy `frontend/dist` as a static site (Vercel, Netlify, Cloudflare Pages, or served by the backend itself with `express.static`) with `VITE_API_URL` pointing at your deployed API.

## Notes

- The habit/notes/meta collections are intentionally singletons (one document each) — that's a straightforward carry-over from the original single-user, single-device design. If you ever want multi-user support, the natural next step is adding a `userId` field to every schema and an auth layer (e.g. JWT + a `User` model) in front of the routes.
- The 365-day heatmaps and week/month strips are computed client-side from the full daily/weekly/monthly maps the API returns — same approach as the original, just fetched over HTTP instead of read from local storage.
