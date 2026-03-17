# Local Development Setup

## Prerequisites

- Node.js (see `.nvmrc` for version)
- npm

---

## 1. Install Dependencies

### Frontend
```bash
npm install
```

### Backend
```bash
cd server
npm install
```

---

## 2. Environment Variables

### Frontend (`.env` in root)
```env
VITE_API_URL=http://localhost:5005/api
VITE_NODE_ENV=development
```

### Backend (`server/.env`)
Key values to confirm:
```env
PORT=5005
FRONTEND_URL=http://localhost:8080
CORS_ORIGIN=http://localhost:5173,http://localhost:8080
JWT_SECRET=<your-secret>
```

> Copy from `.env.example` files if starting fresh.

---

## 3. Start the Backend Server

```bash
cd server
npm run dev
```

Server runs at: `http://localhost:5005`  
Health check: `http://localhost:5005/api/health`

---

## 4. Start the Frontend

```bash
# from project root
npm run dev
```

Frontend runs at: `http://localhost:5173` (or `8080` depending on config)

---

## 5. Network Access (other devices on same WiFi)

To access from another device (phone, tablet, etc.):

1. Find your local IP:
   ```bash
   # Windows
   ipconfig
   ```
2. Update `.env` in root:
   ```env
   VITE_API_URL=http://<your-local-ip>:5005/api
   ```
3. Update `server/.env`:
   ```env
   CORS_ORIGIN=http://<your-local-ip>:5173,http://<your-local-ip>:8080
   ```
4. Restart both servers.

---

## 6. Viewing the Database

The project uses an in-memory / file-based store (no external DB required by default).

To inspect data at runtime, use the health and API endpoints:

- `GET http://localhost:5005/api/health` — server status
- `GET http://localhost:5005/api/auth/me` — current user (requires auth token)

If a database file is used (e.g. SQLite), it will be in `server/` — open it with:
- [DB Browser for SQLite](https://sqlitebrowser.org/) (GUI)
- Or via CLI: `sqlite3 server/<db-file>.sqlite`

---

## Quick Reference

| Task | Command |
|------|---------|
| Start backend | `cd server && npm run dev` |
| Start frontend | `npm run dev` (root) |
| Backend port | 5005 |
| Frontend port | 5173 / 8080 |
| Health check | http://localhost:5005/api/health |
