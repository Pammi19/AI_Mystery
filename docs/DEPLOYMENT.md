# Deploy to Render

The repo includes a Render Blueprint that builds the client and server into one Node web service. The Express service serves both the API and the React single-page app from the same origin, so the browser session cookie stays same-site.

## Before creating the Render service

1. Push this repository to a Git provider connected to Render.
2. Create a MongoDB database reachable from Render. Copy its connection string; do not commit it.
3. Have a Google Gemini API key ready. Do not put it in source code or `render.yaml`.

## Create the service

In Render, create a new Blueprint and select this repository. Render reads the root `render.yaml`, builds with `npm ci --include=dev && npm run build`, starts with `npm start`, and checks `/api/v1/health`. The explicit `--include=dev` is needed because TypeScript and declaration packages are development dependencies required during compilation.

When prompted for unsynced values, supply:

- `MONGODB_URI`: the production MongoDB connection string
- `GEMINI_API_KEY`: the private key from Google AI Studio

The Blueprint asks Render to generate `SESSION_SECRET`. Keep this separate from the value in any local `.env` file. The service uses Render's `PORT` automatically. `CLIENT_ORIGIN` is intentionally unset for this single-origin deployment; configure it only if you later host the client on a different origin.

For MongoDB Atlas, configure network access to allow the deployed Render service to reach the cluster, and use a database user limited to this application's database. Review Render's current outbound IP information before adding Atlas network allow-list entries.

## Verify after deploy

- Open the Render service URL and confirm the Casefile landing page loads.
- Open `https://<service-host>/api/v1/health`; it should return `{ "success": true, "data": { "status": "ok" } }`.
- Create a mystery to confirm the database connection and Gemini key are configured.
- Check Render logs for startup or provider errors. Never paste secrets into logs or support messages.

## Secrets

A value from the local `.env` appeared in the shared IDE context. If it is a credential, rotate it before production use. Do not reuse the local `SESSION_SECRET` in Render; the Blueprint generates a separate production secret. Rotating the local session secret invalidates existing local browser sessions, which is expected for this anonymous-session prototype.
