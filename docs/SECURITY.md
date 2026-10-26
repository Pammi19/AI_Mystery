# Security notes

- Gemini keys are read only by the server from environment configuration.
- Anonymous session IDs are random UUIDs signed with HMAC-SHA256 and stored in HTTP-only, SameSite=Lax cookies. Production cookies are Secure.
- Every case and note lookup is scoped to the session owner. A missing or foreign case is reported as not found.
- Case output is explicitly serialized. The culprit ID, motive, actual timeline, and private evidence significance are not present in pre-verdict responses.
- Accusations are validated against the saved suspect list and atomically accepted only once.
- Inputs and generated case structure are validated; generated references must resolve and decisive evidence must support the culprit.
- Mystery creation is rate-limited. JSON request bodies have a 32 KB limit. Errors are sanitized.
- Configure a strong `SESSION_SECRET`, HTTPS, a specific `CLIENT_ORIGIN`, managed MongoDB access controls, and secret storage before deployment.

The anonymous session cookie is a bearer credential. Users who clear it lose access to their own cases. This prototype does not implement account recovery or cross-device ownership transfer.
