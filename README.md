# Casefile — AI Mystery Room

An interactive fictional investigation game. Start with a premise, examine a persistent evidence file, keep private field notes, and make one final accusation. The server stores the solution and reveals it only after the accusation is recorded.

## Stack

- React, TypeScript, Vite, and React Router
- Node.js, Express, TypeScript, and REST API
- MongoDB with Mongoose
- Google Gemini via the official `@google/genai` SDK
- Zod request and generated-case validation

## Run locally

Requirements: Node.js 20+ and a reachable MongoDB instance. Mystery generation also requires a Google Gemini API key.

1. Copy `.env.example` to `.env` in the repository root and set `MONGODB_URI`, `SESSION_SECRET` (at least 32 random characters), and `GEMINI_API_KEY`. `GEMINI_MODEL` selects the model; it defaults to `gemini-3.8-flash`. The server also loads `server/.env` if you prefer to keep it there.
2. Install dependencies from the repository root with `npm install`.
3. Start the API and client with `npm run dev`.
4. Open `http://localhost:5173`. The Vite development server proxies `/api` requests to Express on port 4000.

The API refuses to start when MongoDB is unavailable. The health endpoint is `GET /api/v1/health`. If Gemini is not configured, generation returns a clear `GENERATION_NOT_CONFIGURED` error; no placeholder case is passed off as generated content.

## Production build

Run `npm run build`, then `npm start` from the repository root. Express serves the compiled frontend and API from one origin. The included Render Blueprint is in [render.yaml](render.yaml); see [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for setup. HTTPS is required in production so the session cookie is secure.

## User sessions and privacy

This first release uses an anonymous, signed, HTTP-only browser session cookie rather than accounts. Cases and notes belong to that session and are isolated on every API query. Clearing browser cookies loses access to that anonymous session's cases. Add an account system and an explicit migration flow before promising cross-device recovery.

## API

All routes use `/api/v1`, JSON, and `{ "success": true, "data": ... }` success envelopes. Errors use `{ "success": false, "error": { "code", "message" } }`.

- `GET /health`
- `POST /mysteries` — synchronously generate and save a validated case
- `GET /mysteries` — list this session's cases
- `GET /mysteries/:caseId` — sanitized case details; includes solution only after completion
- `GET /mysteries/:caseId/evidence` and `POST /mysteries/:caseId/evidence/:evidenceId/review`
- `GET|POST /mysteries/:caseId/notes`; `PATCH|DELETE /mysteries/:caseId/notes/:noteId`
- `POST /mysteries/:caseId/accusation` — atomically records the one allowed accusation
- `GET /mysteries/:caseId/verdict` — completed cases only

See [docs/API.md](docs/API.md), [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), and [docs/SECURITY.md](docs/SECURITY.md).

## Current scope

Generation is synchronous, which the specification permits for a prototype. Image evidence uses textual descriptions and a neutral interface; external image/video generation and object storage are not configured. User accounts and cross-device sync are outside this initial implementation. Render configuration is included, but a live deployment still requires your MongoDB and Gemini credentials and Render account. See `spec.md` for the product requirements and acceptance criteria.
