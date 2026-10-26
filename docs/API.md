# API reference

Base URL: `/api/v1`. The browser receives a signed anonymous session cookie, and ownership is derived from that cookie. Do not accept an owner identifier from request bodies.

## Create a mystery

`POST /mysteries`

```json
{
  "scenario": "A valuable painting disappears during a private gathering.",
  "settings": {
    "difficulty": "medium",
    "category": "theft",
    "suspectCount": 4,
    "tone": "suspenseful",
    "evidenceTypes": ["chat", "document", "cctv"]
  }
}
```

Returns HTTP 201 and `{ "success": true, "data": { "id": "..." } }`. The operation waits for Gemini and validation to finish. The solution remains in the database and is omitted from the response.

## Cases and evidence

- `GET /mysteries` lists the current session's cases.
- `GET /mysteries/:caseId` returns the case overview, suspects, public evidence content, and review progress. `solution`, `culpritId`, and evidence significance are excluded until verdict.
- `GET /mysteries/:caseId/evidence` returns sanitized evidence.
- `POST /mysteries/:caseId/evidence/:evidenceId/review` marks an evidence item as reviewed.

## Notes

- `GET /mysteries/:caseId/notes`
- `POST /mysteries/:caseId/notes` accepts `{ "title": "...", "content": "...", "linkedSuspectIds": [], "linkedEvidenceIds": [] }`.
- `PATCH /mysteries/:caseId/notes/:noteId` updates note fields.
- `DELETE /mysteries/:caseId/notes/:noteId`

## Accusation and verdict

`POST /mysteries/:caseId/accusation` accepts only `{ "suspectId": "..." }`. The server checks membership, compares to the stored culprit, calculates the score (correct: 100 base; medium ×1.5, hard ×2), and atomically closes the case. Subsequent attempts receive HTTP 409. `GET /mysteries/:caseId/verdict` returns the authorized solution after completion.

## Errors

Errors use an HTTP status and `{ "success": false, "error": { "code": "...", "message": "..." } }`. Internal exceptions, prompts, provider responses, credentials, and raw database documents are not returned.
