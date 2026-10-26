# Architecture

The React/Vite client calls an Express REST API. Express validates requests, derives a signed anonymous session identity from an HTTP-only cookie, and calls separate generation and consistency services. Mongoose persists cases and notes in MongoDB. Gemini credentials stay in the server process.

Mystery generation follows: premise/settings validation → Gemini structured JSON request → Zod shape validation → cross-reference and solution consistency checks → MongoDB persistence. The client never calls Gemini.

Case serialization uses a public DTO that whitelists case fields and strips the solution and evidence's private significance fields. A separate verdict branch adds culprit and explanation only for a completed case. Accusation uses a conditional atomic MongoDB update so concurrent requests cannot submit two accusations.

The first release performs generation synchronously. Long-running production generation should move to a durable queue and persisted generation-job collection before request timeouts become a concern.
