# AI MYSTERY ROOM

## Product Requirements & Technical Specification

**Document Type:** Single Source of Truth (SSOT) for Spec-Driven Development
**Project Name:** AI Mystery Room
**Version:** 1.0.0
**Status:** Initial Specification
**Architecture:** MERN Stack
**AI Provider:** Google Gemini
**Primary Development Tool:** OpenAI Codex
**Specification File:** `SPEC.md`

---

# 1. PROJECT OVERVIEW

## 1.1 Project Description

AI Mystery Room is an AI-powered interactive mystery investigation platform where users become detectives and solve fictional cases generated from scenarios or stories they provide.

The user submits a short story, scenario, or mystery premise. The backend uses Google Gemini to transform that input into a complete fictional investigation containing:

* A mystery case with a compelling storyline.
* A defined set of fictional characters.
* One predetermined culprit.
* Motives, timelines, and relationships.
* AI-generated evidence, such as chat conversations, images, CCTV-style recordings, and witness statements.
* Clues, contradictions, and red herrings.
* An investigation interface where users analyze the evidence.
* A final accusation interface where users select the culprit.
* A case resolution explaining the correct answer and the reasoning behind it.

The user explores the case, examines the evidence, forms a theory, and submits a final accusation.

The system evaluates the accusation against the original case solution and provides a detailed explanation.

**Core product principle:** Every mystery must have a logically consistent solution established before the user starts investigating. Evidence must support that solution without changing the culprit or the underlying facts during gameplay.

## 1.2 Product Vision

Create an immersive, replayable mystery-solving experience that combines AI-generated storytelling, investigative reasoning, and interactive evidence analysis.

The experience should feel like investigating a fictional crime scene rather than simply reading an AI-generated story.

## 1.3 Target Audience

* Mystery and detective-story enthusiasts.
* Casual gamers.
* Students interested in logical reasoning.
* Users who enjoy interactive storytelling.
* People looking for AI-powered entertainment.

## 1.4 Product Goals

1. Allow users to create a mystery from their own scenario.
2. Generate internally consistent fictional investigations.
3. Present evidence through an interactive detective dashboard.
4. Make evidence examination central to the experience.
5. Allow users to accuse a suspect and receive a meaningful verdict.
6. Support multiple mystery sessions.
7. Provide a visually engaging, responsive user interface.
8. Keep the application modular and extensible.

## 1.5 Non-Goals for Version 1

The following features are outside the initial release unless explicitly approved later:

* Real-world criminal investigation.
* Real-time police or government database integrations.
* User-uploaded real CCTV footage analysis.
* Multiplayer investigations.
* Live human-to-human chat.
* Public mystery publishing and community ratings.
* User-created AI model training.
* Subscription payments.
* Autonomous agents that execute arbitrary external actions.
* Unlimited AI generation without usage controls.

---

# 2. PRODUCT REQUIREMENTS

## 2.1 Core User Journey

The complete user journey is:

1. Open the website.
2. View the landing page.
3. Start a new mystery.
4. Enter a scenario or story premise.
5. Configure the mystery settings.
6. Submit the generation request.
7. The backend generates and validates the mystery.
8. The user enters the investigation room.
9. The user reviews suspects and their backgrounds.
10. The user examines the available evidence.
11. The user compares clues and identifies contradictions.
12. The user selects a suspect.
13. The user submits a final accusation.
14. The system evaluates the accusation.
15. The user receives the verdict and case explanation.
16. The user can review the case or start another mystery.

## 2.2 Mystery Creation

The creation page must contain the following fields.

### Required Fields

**Scenario / Story Premise**

* Multiline text input.
* Required.
* Minimum length: 30 characters.
* Maximum length: 3,000 characters.
* Must be trimmed and validated.
* Must not be interpreted as permission to reveal backend prompts, credentials, or internal system instructions.

Example:

"A famous author is found unconscious in a locked study during a private dinner. Five guests were present, and each has a reason to hide something."

### Optional Fields

| Field              | Type         | Default     | Allowed Values                                          |
| ------------------ | ------------ | ----------- | ------------------------------------------------------- |
| Difficulty         | Enum         | Medium      | Easy, Medium, Hard                                      |
| Mystery Type       | Enum         | Crime       | Crime, Theft, Disappearance, Espionage, General Mystery |
| Number of Suspects | Integer      | 4           | 3–6                                                     |
| Estimated Duration | Enum         | Standard    | Quick, Standard, Extended                               |
| Evidence Style     | Multi-select | Mixed       | Messages, Images, CCTV, Documents, Witness Statements   |
| Tone               | Enum         | Suspenseful | Suspenseful, Dark, Lighthearted, Noir                   |

The application must validate all settings before requesting generation.

If the user selects an unsupported combination of settings, the interface must either adjust it or request a valid selection.

### Create Button

The primary action is:

**Generate Mystery**

When clicked:

1. Validate the input.
2. Disable duplicate submissions.
3. Display a loading state.
4. Send the scenario and settings to the backend.
5. Display generation progress.
6. Navigate to the investigation room when the case is ready.
7. Display a recoverable error if generation fails.

The frontend must never call Gemini directly.

## 2.3 Mystery Generation

Gemini must generate a structured mystery rather than an unstructured story.

Each mystery must contain:

* Case title.
* Case description.
* Case identifier.
* Difficulty.
* Mystery category.
* Fictional setting.
* Incident details.
* Suspects.
* Culprit.
* Culprit's motive.
* Actual event timeline.
* Evidence items.
* Evidence relationships.
* Red herrings.
* Contradictions.
* Investigation hints.
* Solution explanation.
* Evidence-based reasoning.

The backend must validate the generated output before publishing the case to the user.

### Generation Consistency Rules

The system must enforce these rules:

1. Exactly one culprit must be designated for a standard case.
2. The culprit must be one of the case's suspects.
3. The actual event timeline must be internally consistent.
4. Evidence must refer only to characters and events in the case.
5. Evidence timestamps must be consistent with the timeline.
6. The solution must be established before gameplay begins.
7. The system must not change the culprit after generation.
8. Red herrings must be misleading but explainable.
9. The solution must be supported by the evidence.
10. The mystery must not require information that the user cannot discover.
11. Every case must have a deterministic correct answer.
12. Generated evidence must not accidentally reveal the culprit through filenames, metadata, API responses, or frontend state.

If validation fails, the backend may request a bounded correction from Gemini. If validation still fails, the system must return a controlled error rather than publish an inconsistent case.

---

# 3. INVESTIGATION ROOM

## 3.1 Purpose

The investigation room is the primary gameplay interface.

It must allow users to navigate between suspects, evidence, case details, and their final accusation.

The layout should resemble a modern digital detective workspace.

## 3.2 Main Layout

The investigation room should contain:

### A. Case Header

Display:

* Case title.
* Case identifier.
* Mystery category.
* Difficulty.
* Current investigation status.
* Number of evidence items reviewed.
* Investigation navigation.

### B. Case Overview

Display:

* Incident summary.
* Location.
* Time of incident.
* Important background information.
* Investigation objectives.

The overview must not disclose the solution or culprit.

### C. Suspect Board

Display a card for every suspect.

Each suspect card should contain:

* Display name.
* AI-generated fictional portrait, when available.
* Short biography.
* Relationship to the incident.
* Alibi summary.
* Relevant known facts.

The initial suspect board must not identify the culprit.

Suspect information must not be generated independently during each page load. It must come from the saved case.

### D. Evidence Board

Display all evidence items as interactive cards.

Each evidence card should contain:

* Evidence title.
* Evidence category.
* Short description.
* Thumbnail, when available.
* Discovery status.
* Examination status.

Clicking a card opens its detailed examination view.

### E. Investigation Notes

Allow users to record observations and theories.

Users should be able to:

* Create a note.
* Edit a note.
* Delete a note.
* Associate a note with a suspect.
* Associate a note with evidence.

Notes are private to the case owner.

Notes must not automatically change the generated mystery or the correct solution.

### F. Accusation Panel

Provide a clear action:

**Make an Accusation**

The accusation flow must display all suspects and allow the user to select exactly one.

Before final submission, display a confirmation step.

After submission, the accusation must be locked for that case in Version 1.

The application must not allow the user to submit multiple accusations to repeatedly test suspects within the same case.

## 3.3 Investigation Progress

The interface should track:

* Evidence examined.
* Suspects reviewed.
* Notes created.
* Accusation status.
* Case completion status.

Progress tracking is for user guidance. It must not reveal the culprit.

The user may accuse a suspect before reviewing all evidence. The interface may display a confirmation warning, but must not force the user to inspect every item unless that requirement is explicitly introduced later.

---

# 4. AI-GENERATED EVIDENCE

## 4.1 Evidence Categories

The system must support the following evidence categories.

### A. Chat Messages

Examples:

* WhatsApp-style conversations.
* SMS exchanges.
* Fictional direct messages.
* Group conversations.

Each conversation must include:

* Participants.
* Timestamp for each message.
* Message text.
* Optional attachment references.
* Optional contextual information.

Chat evidence must be generated as fictional content.

The visual interface may use a familiar messaging layout but must not imply that the conversation was retrieved from a real person's account.

### B. Images

Examples:

* Fictional crime scenes.
* Objects found at a location.
* Suspect-related locations.
* Photographs of relevant items.
* Environmental details.

The backend may use an image-generation provider for visual assets.

Gemini must not be assumed to generate a downloadable image merely because it returns a textual description. Actual image generation requires a supported image-generation model or service.

If image generation is unavailable, the application must still work using:

* Evidence descriptions.
* Generated illustrations from a supported provider, if configured.
* Neutral placeholder graphics.

### C. CCTV-Style Evidence

Examples:

* Corridor camera observations.
* Entrance and exit logs.
* Fictional surveillance snapshots.
* Event timestamps.
* Descriptions of people moving through locations.

For Version 1, CCTV evidence should be implemented primarily as a structured transcript or sequence of observations.

Example:

"21:14 — A person wearing a dark jacket enters the east corridor."

Actual video generation is optional and must not be a dependency for the core application.

If video generation is introduced later, it must use a separately configured provider and must have a defined processing and storage lifecycle.

### D. Documents

Examples:

* Letters.
* Receipts.
* Access logs.
* Meeting notes.
* Fictional reports.
* Printed records.

### E. Witness Statements

Each witness statement must contain:

* Witness identity.
* Statement.
* Time of statement.
* Relevant observations.
* Optional reliability indicators.

Witness reliability indicators must not reveal the culprit directly.

### F. Physical Evidence

Examples:

* A missing key.
* An unusual fingerprint report.
* A damaged object.
* A misplaced item.
* An inconsistent receipt timestamp.

Physical evidence should be represented as structured descriptions unless a visual asset is available.

## 4.2 Evidence Model

Every evidence item must have:

* Unique evidence ID.
* Case ID.
* Title.
* Category.
* Description.
* Content payload.
* Optional media URL.
* Creation timestamp.
* Discovery timestamp, when relevant.
* Associated suspects.
* Related evidence IDs.
* Investigation significance.
* Review status.

The investigation significance and internal reasoning must be private backend data.

The frontend must receive only the information required to display the evidence.

## 4.3 Evidence Integrity

The system must maintain a distinction between:

1. Facts known to the backend.
2. Facts revealed to the player.
3. The solution and its supporting reasoning.

The frontend must not receive the culprit ID or secret solution before the case is completed.

Evidence examination must not trigger a fresh generation of the entire mystery.

All evidence must be saved and served from the persisted case.

---

# 5. VERDICT AND CASE RESOLUTION

## 5.1 Accusation Submission

The user selects one suspect and confirms the accusation.

The frontend sends only the selected suspect ID.

The backend must:

1. Authenticate the user if authentication is enabled.
2. Verify that the case belongs to the user.
3. Confirm that the case is still open.
4. Verify that the suspect belongs to that case.
5. Ensure that no accusation has already been submitted.
6. Record the accusation.
7. Compare the accusation with the stored culprit ID.
8. Mark the case as completed.
9. Return the verdict and authorized solution explanation.

The client must not determine whether the answer is correct.

## 5.2 Verdict Page

Display:

* Correct or incorrect verdict.
* User's selected suspect.
* Actual culprit.
* Culprit's motive.
* Reconstruction of the incident.
* Important evidence.
* Explanation of the decisive clues.
* Explanation of misleading evidence.
* Final case status.

The solution must be revealed only after a valid accusation has been submitted.

## 5.3 Scoring

Version 1 should use a simple scoring system.

Suggested rules:

* Correct accusation: 100 base points.
* Incorrect accusation: 0 base points.
* Optional difficulty multiplier: Easy ×1, Medium ×1.5, Hard ×2.

The difficulty multiplier may be applied to the base score.

The scoring rules must be deterministic and implemented on the backend.

No score may depend on hidden client-side calculations.

If difficulty multipliers are enabled, the interface must explain the scoring rules.

---

# 6. USER INTERFACE AND EXPERIENCE

## 6.1 Design Direction

The interface should have a premium detective-investigation aesthetic.

Suggested visual direction:

* Dark charcoal background.
* Muted navy surfaces.
* Amber or red accents.
* Off-white typography.
* Subtle borders.
* Evidence cards resembling case files.
* Clear visual hierarchy.
* Smooth, restrained animations.

These are design defaults, not mandatory dependencies.

The design must remain readable and accessible.

Avoid excessive animations, unnecessary visual clutter, and overly bright colors that reduce readability.

## 6.2 Required Pages

### Page 1: Landing Page

Components:

* Navigation bar.
* Product logo and name.
* Hero heading.
* Brief product explanation.
* Primary CTA: "Create a Mystery".
* Secondary CTA: "Explore How It Works".
* Feature cards.
* Example mystery preview.
* Footer.

### Page 2: Mystery Creation

Components:

* Scenario text area.
* Difficulty selector.
* Mystery category selector.
* Suspect count selector.
* Tone selector.
* Evidence type selector.
* Generate button.
* Input validation messages.

### Page 3: Generation Progress

Components:

* Loading animation.
* Current generation stage.
* Progress indicator.
* Cancel or return option where safe.
* Retry option after recoverable failures.

The progress indicator must reflect actual backend job status where available. It must not display fabricated percentage completion.

### Page 4: Investigation Room

Components:

* Case header.
* Case overview.
* Suspect board.
* Evidence board.
* Evidence detail panel.
* Investigation notes.
* Progress tracker.
* Accusation button.

### Page 5: Verdict

Components:

* Verdict banner.
* Selected suspect.
* Actual culprit.
* Case explanation.
* Decisive clues.
* Timeline reconstruction.
* Final score.
* New Mystery button.

### Page 6: My Cases

Components:

* List of saved cases.
* Case title.
* Creation date.
* Difficulty.
* Status.
* Last activity.
* Continue investigation button.
* View verdict button for completed cases.

This page requires persistence and user ownership controls.

## 6.3 Responsive Design

The website must work on:

* Desktop.
* Laptop.
* Tablet.
* Mobile.

Desktop may use a multi-column investigation workspace.

Mobile must use a single-column layout with accessible navigation between suspects, evidence, notes, and case details.

The application must not require horizontal scrolling for normal usage on a mobile screen.

## 6.4 Accessibility

The application should:

* Use semantic HTML.
* Provide accessible form labels.
* Support keyboard navigation.
* Display visible focus states.
* Use sufficient contrast.
* Include alt text for meaningful images.
* Avoid relying on color alone to communicate verdicts or evidence states.
* Respect reduced-motion preferences.

---

# 7. TECHNOLOGY STACK

## 7.1 Frontend

Required:

* React.
* Vite.
* JavaScript or TypeScript.
* React Router.
* Fetch API or Axios.
* CSS Modules, standard CSS, or another consistent styling solution.

Preferred:

* TypeScript.
* A reusable component architecture.
* A consistent design system.
* React Query or an equivalent server-state library when useful.

The implementation must choose one approach for each major concern and use it consistently.

Do not introduce unnecessary libraries.

## 7.2 Backend

Required:

* Node.js.
* Express.js.
* JavaScript or TypeScript.
* REST API.
* Google Gemini API integration.
* Server-side request validation.
* Centralized error handling.

Preferred:

* TypeScript across frontend and backend.
* Zod or an equivalent schema validation library.
* Structured logging.
* A dedicated Gemini service module.
* A separate case-generation service.

## 7.3 Database

Required:

* MongoDB.
* Mongoose or an equivalent MongoDB data-access layer.

MongoDB stores:

* Users, if authentication is enabled.
* Mystery cases.
* Evidence.
* Investigation notes.
* Accusations.
* Scores.
* Generation job status.

Large media files should not be stored directly in MongoDB documents. Store media in a suitable object-storage provider and save references in MongoDB.

## 7.4 AI Provider

Primary AI provider:

* Google Gemini.

Use a supported Gemini model selected through environment configuration.

Do not hardcode an assumed model name throughout the application.

The model must be configurable because model availability, capabilities, and pricing can change.

Use the official Gemini API documentation as the reference for the selected model, supported response formats, authentication, and request limits.

## 7.5 Architecture Overview

The logical request flow is:

React Frontend
↓
Express REST API
↓
Validation and Authentication
↓
Mystery Generation Service
↓
Gemini API
↓
Structured Output Validation
↓
Consistency Validation
↓
MongoDB Persistence
↓
Sanitized Case Response
↓
React Investigation Room

For subsequent requests:

React Frontend
↓
Express REST API
↓
Authorization and Case Service
↓
MongoDB
↓
Sanitized Response

For final accusations:

React Frontend
↓
Accusation API
↓
Server-Side Validation
↓
Stored Culprit Comparison
↓
Persisted Verdict
↓
Verdict Response

---

# 8. RECOMMENDED PROJECT STRUCTURE

Use a monorepo with separate frontend and backend directories.

```text
ai-mystery-room/
│
├── SPEC.md
├── README.md
├── .gitignore
├── .env.example
│
├── client/
│   ├── package.json
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       │
│       ├── components/
│       │   ├── layout/
│       │   ├── common/
│       │   ├── suspects/
│       │   ├── evidence/
│       │   └── investigation/
│       │
│       ├── pages/
│       │   ├── HomePage.tsx
│       │   ├── CreateMysteryPage.tsx
│       │   ├── GenerationPage.tsx
│       │   ├── InvestigationPage.tsx
│       │   ├── VerdictPage.tsx
│       │   └── MyCasesPage.tsx
│       │
│       ├── hooks/
│       ├── services/
│       │   └── api.ts
│       ├── types/
│       ├── utils/
│       └── styles/
│
├── server/
│   ├── package.json
│   └── src/
│       ├── server.ts
│       ├── app.ts
│       │
│       ├── config/
│       │   ├── database.ts
│       │   └── env.ts
│       │
│       ├── routes/
│       │   ├── health.routes.ts
│       │   ├── mystery.routes.ts
│       │   ├── evidence.routes.ts
│       │   ├── notes.routes.ts
│       │   └── accusation.routes.ts
│       │
│       ├── controllers/
│       ├── services/
│       │   ├── gemini.service.ts
│       │   ├── mystery-generation.service.ts
│       │   ├── mystery-validation.service.ts
│       │   ├── evidence.service.ts
│       │   ├── accusation.service.ts
│       │   └── scoring.service.ts
│       │
│       ├── models/
│       │   ├── User.ts
│       │   ├── MysteryCase.ts
│       │   ├── InvestigationNote.ts
│       │   └── GenerationJob.ts
│       │
│       ├── middleware/
│       │   ├── auth.middleware.ts
│       │   ├── error.middleware.ts
│       │   ├── rate-limit.middleware.ts
│       │   └── validate.middleware.ts
│       │
│       ├── schemas/
│       ├── utils/
│       └── tests/
│
└── docs/
    ├── API.md
    ├── ARCHITECTURE.md
    └── SECURITY.md
```

This structure is a starting point, not a requirement to create every empty file immediately.

Implement only the modules needed for the current milestone.

---

# 9. DATABASE DESIGN

## 9.1 MysteryCase Collection

Each case must have a stable MongoDB document ID.

Suggested structure:

```json
{
  "_id": "mongodb-generated-id",
  "ownerId": "user-id-or-null-for-demo",
  "title": "The Locked Study",
  "scenario": "Original user-provided premise",
  "category": "crime",
  "difficulty": "medium",
  "status": "ready",
  "setting": {
    "location": "Blackwood Manor",
    "incidentTime": "2026-10-25T21:00:00Z"
  },
  "description": "A fictional incident summary",
  "suspects": [
    {
      "id": "suspect-1",
      "name": "Alex Morgan",
      "bio": "A fictional character biography",
      "relationship": "Business partner",
      "publicAlibi": "Claims to have been in the library"
    }
  ],
  "solution": {
    "culpritId": "suspect-2",
    "motive": "Private motive",
    "explanation": "Private solution explanation",
    "actualTimeline": [],
    "decisiveEvidenceIds": []
  },
  "evidence": [],
  "accusation": null,
  "score": null,
  "createdAt": "ISO-date",
  "updatedAt": "ISO-date",
  "completedAt": null
}
```

This is a logical example. Production schemas must use appropriate MongoDB types, references, validation, and timestamps.

### Important Security Requirement

The `solution` field must never be serialized directly into a normal case response.

Create separate response DTOs or serializers for:

* Public case details.
* Evidence details.
* Private solution data.
* Final verdict data.

Do not rely on frontend code to hide secret fields that were already delivered by the API.

## 9.2 Evidence Structure

Each evidence item should contain:

```json
{
  "id": "evidence-1",
  "type": "chat",
  "title": "Messages Before the Incident",
  "description": "A conversation between two suspects",
  "content": {
    "participants": [
      "suspect-1",
      "suspect-2"
    ],
    "messages": [
      {
        "senderId": "suspect-1",
        "timestamp": "2026-10-25T20:10:00Z",
        "text": "We need to talk before dinner."
      }
    ]
  },
  "media": {
    "url": null,
    "mimeType": null
  },
  "associatedSuspectIds": [
    "suspect-1",
    "suspect-2"
  ],
  "relatedEvidenceIds": [],
  "reviewedBy": [],
  "createdAt": "ISO-date"
}
```

The backend may store additional private fields such as:

* `significance`.
* `truthStatus`.
* `supportsCulprit`.
* `contradictionDetails`.

These fields must not appear in ordinary evidence responses.

## 9.3 Investigation Notes

Suggested fields:

```json
{
  "_id": "note-id",
  "ownerId": "user-id",
  "caseId": "case-id",
  "title": "Timeline inconsistency",
  "content": "The suspect's stated time conflicts with the camera log.",
  "linkedSuspectIds": [
    "suspect-1"
  ],
  "linkedEvidenceIds": [
    "evidence-1"
  ],
  "createdAt": "ISO-date",
  "updatedAt": "ISO-date"
}
```

## 9.4 Generation Jobs

AI generation may take longer than a normal API request.

Use a generation job record when asynchronous processing is implemented.

Suggested fields:

* Job ID.
* Owner ID.
* Status.
* Requested settings.
* Retry count.
* Sanitized error code.
* Created timestamp.
* Updated timestamp.
* Completion timestamp.
* Resulting case ID.

Allowed statuses:

`queued`, `processing`, `validating`, `completed`, `failed`, `cancelled`.

Do not store API keys or unnecessary raw provider responses in job records.

## 9.5 Indexes

Create appropriate indexes for:

* Case owner and creation date.
* Case status.
* Generation job owner and status.
* Notes by owner and case.
* Idempotency keys for generation and accusation requests, where applicable.

Enforce single-accusation behavior using an atomic database operation or another concurrency-safe approach.

---

# 10. API SPECIFICATION

Base path:

`/api/v1`

All successful responses must use a consistent JSON format.

Suggested success response:

```json
{
  "success": true,
  "data": {}
}
```

Suggested error response:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please provide a valid mystery scenario."
  }
}
```

Do not expose stack traces, provider credentials, internal prompts, or raw sensitive database documents.

## 10.1 Health Check

**GET** `/api/v1/health`

Purpose:

* Check API availability.

Example response:

```json
{
  "success": true,
  "data": {
    "status": "ok"
  }
}
```

Do not expose credentials, internal network configuration, or detailed infrastructure information.

## 10.2 Create Mystery

**POST** `/api/v1/mysteries`

Request:

```json
{
  "scenario": "A valuable painting disappears during a private gathering.",
  "settings": {
    "difficulty": "medium",
    "category": "theft",
    "suspectCount": 4,
    "tone": "suspenseful",
    "evidenceTypes": [
      "chat",
      "document",
      "cctv"
    ]
  }
}
```

Behavior:

1. Validate the request.
2. Check authentication or demo-session ownership.
3. Apply rate limits.
4. Create a generation job.
5. Generate and validate the case.
6. Persist the case.
7. Return the job ID or resulting case ID.

For asynchronous generation:

**Response: HTTP 202 Accepted**

```json
{
  "success": true,
  "data": {
    "jobId": "generation-job-id",
    "status": "queued"
  }
}
```

The frontend polls the generation-job endpoint until completion or failure.

For a small prototype, synchronous generation is acceptable if timeouts and failure handling are implemented correctly.

## 10.3 Get Generation Status

**GET** `/api/v1/mysteries/jobs/:jobId`

Return:

* Job ID.
* Status.
* Progress stage.
* Resulting case ID when ready.
* Sanitized error when failed.

Never return private solution fields.

## 10.4 List Mysteries

**GET** `/api/v1/mysteries`

Optional query parameters:

* `status`.
* `difficulty`.
* `page`.
* `limit`.

Return only cases accessible to the current user.

## 10.5 Get Mystery Details

**GET** `/api/v1/mysteries/:caseId`

Return:

* Public case details.
* Suspects.
* Evidence summaries.
* Progress.
* Current case status.

Never return:

* Culprit ID.
* Private motive details.
* Hidden timeline.
* Private evidence significance.
* Final solution before completion.

## 10.6 Get Evidence

**GET** `/api/v1/mysteries/:caseId/evidence`

Return evidence summaries for the case.

Support pagination if needed.

## 10.7 Get Evidence Details

**GET** `/api/v1/mysteries/:caseId/evidence/:evidenceId`

Return the requested evidence content after checking case access.

Never expose private reasoning or the final solution.

## 10.8 Create Investigation Note

**POST** `/api/v1/mysteries/:caseId/notes`

Request:

```json
{
  "title": "Possible contradiction",
  "content": "The witness statement conflicts with the recorded timeline.",
  "linkedSuspectIds": [
    "suspect-1"
  ],
  "linkedEvidenceIds": [
    "evidence-1"
  ]
}
```

The backend must validate that linked suspects and evidence belong to the specified case.

## 10.9 Update Investigation Note

**PATCH** `/api/v1/mysteries/:caseId/notes/:noteId`

Update only fields allowed by the schema.

## 10.10 Delete Investigation Note

**DELETE** `/api/v1/mysteries/:caseId/notes/:noteId`

Only the note owner may delete it.

## 10.11 Submit Accusation

**POST** `/api/v1/mysteries/:caseId/accusation`

Request:

```json
{
  "suspectId": "suspect-2"
}
```

Correctness must be determined on the server.

A successful response should contain:

* Whether the accusation was correct.
* Selected suspect.
* Final case status.
* Authorized solution explanation.
* Score.

The response must be based on the persisted case solution.

Repeated requests must not permit multiple attempts.

## 10.12 Get Verdict

**GET** `/api/v1/mysteries/:caseId/verdict`

The verdict is available only after the case is completed.

Return the stored verdict rather than generating a new answer with Gemini.

---

# 11. GEMINI INTEGRATION

## 11.1 Service Responsibilities

Create a dedicated Gemini service responsible for:

* Model configuration.
* Authentication.
* Request construction.
* Structured output handling.
* Timeout management.
* Retry policies.
* Provider error normalization.
* Usage tracking.

Do not call Gemini directly from React components or API route handlers.

## 11.2 Generation Pipeline

Use the following pipeline:

**Stage 1: Scenario Analysis**

Extract:

* Main incident.
* Setting.
* Important constraints.
* Desired tone.
* Mystery category.
* Difficulty.

**Stage 2: Case Planning**

Generate:

* Characters.
* Motives.
* Actual event timeline.
* Culprit.
* Supporting facts.
* Alternative suspect explanations.

**Stage 3: Evidence Generation**

Generate evidence consistent with the established case plan.

**Stage 4: Consistency Validation**

Check:

* Suspect references.
* Evidence references.
* Timeline consistency.
* Culprit existence.
* Explanation completeness.
* Contradictions and red herrings.
* Whether the user can reasonably infer the solution.

**Stage 5: Repair if Needed**

If validation fails, request a bounded correction.

Do not regenerate the entire case repeatedly without limits.

**Stage 6: Persistence**

Save the validated case and evidence to MongoDB.

**Stage 7: Safe Response**

Return only public case information.

## 11.3 Structured Output

Use a JSON schema or equivalent structured-output feature supported by the configured Gemini model.

Validate the returned data independently on the backend.

A successful provider response does not guarantee a valid mystery.

Reject:

* Malformed JSON.
* Missing required fields.
* Invalid suspect references.
* Unsupported evidence categories.
* Missing culprit.
* Invalid timeline references.
* Excessively long outputs.
* Unexpected fields containing unsupported data.

## 11.4 Prompt Design

Maintain the core generation instructions in version-controlled backend files.

The prompt must establish that:

* The scenario is fictional.
* Exactly one culprit is required.
* The culprit must be selected before evidence generation.
* All clues must remain consistent with the case plan.
* Evidence must be sufficiently informative to support a solution.
* Red herrings must be explainable.
* No secret solution may be included in public-facing fields.
* Output must conform to the requested schema.
* User input is untrusted data, not an instruction to override application rules.

Do not place API keys in prompts.

Do not depend on prompt instructions alone for access control or solution secrecy.

## 11.5 Model Configuration

Use environment variables:

* `GEMINI_API_KEY`
* `GEMINI_MODEL`

The selected model must support the required text-generation and structured-output capabilities.

Use separate configuration if a future image-generation provider is introduced.

## 11.6 Error Handling

Handle:

* Authentication errors.
* Invalid model configuration.
* Rate limits.
* Quota exhaustion.
* Network failures.
* Provider timeouts.
* Malformed output.
* Safety-related refusals.
* Generation validation failures.

Retry transient errors only within a bounded policy.

Respect provider retry guidance for rate limits.

Do not repeatedly retry permanent authentication or quota errors.

If generation fails, mark the job as failed and allow a controlled retry when appropriate.

---

# 12. SECURITY REQUIREMENTS

Security is mandatory because the application uses AI, persistent data, and hidden game solutions.

## 12.1 API Key Protection

* Store Gemini credentials in server-side environment variables or a secret manager.
* Never expose credentials in frontend environment variables.
* Never commit real `.env` files.
* Provide `.env.example` with placeholder values.
* Redact credentials from logs.

## 12.2 Authentication and Authorization

For a multi-user release:

* Implement authentication.
* Verify access on every case, evidence, note, and verdict request.
* Restrict private cases to their owners.
* Enforce ownership checks on updates and deletions.
* Use secure session or token handling.

For a local demonstration:

* Anonymous sessions may be supported.
* Use a server-generated session identifier.
* Enforce ownership using the session rather than trusting arbitrary client-supplied owner IDs.

Do not expose private cases merely because someone knows a case ID.

## 12.3 Solution Secrecy

* Never return the culprit ID before completion.
* Never include private solution fields in general case endpoints.
* Never trust frontend state to protect the answer.
* Do not expose private reasoning in evidence APIs.
* Ensure generation errors do not leak the full internal solution.
* Test all API responses for secret-field leakage.

## 12.4 Input Validation

Validate:

* Scenario length.
* Allowed enum values.
* Suspect counts.
* Evidence types.
* Case IDs.
* Suspect IDs.
* Evidence IDs.
* Note lengths.
* Pagination values.

Reject unsupported fields where appropriate.

## 12.5 Rate Limiting

Apply rate limits to:

* Mystery creation.
* Generation retries.
* Evidence-related requests where appropriate.
* Accusation submission.
* Authentication endpoints.

Add per-user or per-session generation quotas to control AI costs.

## 12.6 AI Output Safety

Treat AI output as untrusted content.

* Escape text before rendering.
* Do not render raw model output as executable HTML.
* Sanitize supported rich-text content.
* Validate media URLs.
* Avoid arbitrary URL fetching.
* Prevent generated content from triggering server-side tool execution.
* Do not allow the model to access environment variables or secrets.

## 12.7 Privacy

* Store only necessary user data.
* Restrict logs containing user-provided scenarios.
* Define a deletion policy for cases and generated media.
* Clearly identify the content as fictional.
* Do not claim that generated evidence is authentic evidence from a real investigation.

---

# 13. PERFORMANCE AND RELIABILITY

## 13.1 Performance

The application should:

* Load normal pages quickly.
* Fetch evidence on demand where useful.
* Paginate case history.
* Avoid regenerating content during page navigation.
* Use caching only where correctness and authorization remain intact.

AI generation is expected to be slower than ordinary API requests.

Use asynchronous jobs when generation duration could exceed normal request timeouts.

## 13.2 Reliability

The system must:

* Persist a completed case before exposing it as ready.
* Prevent duplicate case creation from accidental repeated requests.
* Handle partial generation failures.
* Avoid orphaned generation jobs.
* Preserve completed verdicts.
* Prevent multiple accusations under concurrent requests.
* Return meaningful error states.

## 13.3 Observability

Record structured events for:

* Generation started.
* Generation completed.
* Generation failed.
* Validation failed.
* Gemini latency.
* Token usage where available.
* Estimated AI cost where measurable.
* API response time.
* Database errors.
* Rate-limit events.
* Accusation submitted.

Do not log:

* API keys.
* Authentication secrets.
* Unnecessary personal data.
* Private solution content in ordinary application logs.

Include request IDs to help correlate failures.

---

# 14. ENVIRONMENT CONFIGURATION

Create `.env.example` at the project root.

Suggested variables:

```env
NODE_ENV=development

CLIENT_URL=http://localhost:5173
SERVER_PORT=5000

MONGODB_URI=mongodb://127.0.0.1:27017/ai_mystery_room

GEMINI_API_KEY=replace_with_your_key
GEMINI_MODEL=replace_with_supported_model

SESSION_SECRET=replace_with_a_long_random_secret

# Optional media provider
IMAGE_GENERATION_API_KEY=
IMAGE_GENERATION_MODEL=
MEDIA_STORAGE_BUCKET=
```

The exact variables must match the selected libraries and deployment architecture.

Never use these placeholder values as production credentials.

Do not require optional media-provider variables when the core application can function without generated images or videos.

---

# 15. TESTING STRATEGY

## 15.1 Unit Tests

Test:

* Scenario validation.
* Settings validation.
* Mystery schema validation.
* Culprit existence.
* Evidence reference integrity.
* Timeline consistency rules.
* Scoring calculations.
* Public case serialization.
* Verdict generation from stored data.

## 15.2 API Integration Tests

Test:

* Create mystery.
* Retrieve generation status.
* Retrieve case details.
* Retrieve evidence.
* Create and edit notes.
* Submit a correct accusation.
* Submit an incorrect accusation.
* Retrieve the verdict.
* Reject unauthorized requests.
* Reject invalid IDs.
* Reject duplicate accusations.
* Handle provider errors.

Mock Gemini during deterministic tests.

Do not depend on live Gemini calls for every test run.

## 15.3 Frontend Tests

Test:

* Form validation.
* Loading states.
* Generation failures.
* Evidence examination.
* Suspect navigation.
* Note management.
* Accusation confirmation.
* Verdict display.
* Responsive layouts.
* Empty states.

## 15.4 Security Tests

Verify that:

* Culprit data is absent from pre-verdict responses.
* Private solution details cannot be accessed directly.
* Users cannot access another user's case.
* Evidence IDs cannot be used across unrelated cases.
* Client-side changes cannot manipulate the verdict.
* Duplicate submissions do not create multiple accusations.
* Generated content cannot execute scripts in the browser.

## 15.5 Mystery Quality Tests

Use a collection of representative scenarios to test:

* Different mystery categories.
* Different difficulty levels.
* Different suspect counts.
* Short and long scenarios.
* Conflicting or ambiguous user input.
* Provider failures.
* Malformed model responses.

Evaluate whether each mystery has:

* One correct culprit.
* A consistent timeline.
* Sufficient evidence.
* Explainable red herrings.
* A defensible solution.

AI-generated mystery quality requires both automated validation and periodic human review.

---

# 16. ACCEPTANCE CRITERIA

The application is ready for its first functional release when all mandatory criteria are satisfied.

## AC-01: Mystery Creation

Given a valid scenario, the user can submit the form and generate a mystery.

Invalid scenarios must receive understandable validation errors.

## AC-02: Case Generation

The backend generates a structured case with a title, description, suspects, culprit, timeline, evidence, and solution.

The culprit must belong to the suspect list.

## AC-03: Evidence Persistence

Evidence is saved with the case and remains consistent across page reloads.

## AC-04: Investigation

The user can examine suspects and evidence without being shown the answer.

## AC-05: Evidence Types

The system supports text-based chat evidence, documents, witness statements, physical evidence, and CCTV-style observations.

Images are supported when an image-generation provider is configured.

Actual video generation is optional.

## AC-06: Notes

The user can create, update, and delete private investigation notes.

## AC-07: Accusation

The user can submit exactly one accusation for a case.

The backend validates the selected suspect.

## AC-08: Verdict

The user receives a correct or incorrect verdict and a coherent solution explanation.

## AC-09: Persistence

A completed case remains available after a browser refresh or server restart, subject to the configured database and deployment.

## AC-10: Solution Protection

The culprit and private solution are not included in pre-verdict API responses.

## AC-11: Error Handling

The application gracefully handles generation failures, rate limits, invalid input, and database errors.

## AC-12: Security

API credentials remain server-side, and case ownership is enforced wherever private user data is supported.

## AC-13: Responsive Interface

All required pages work on desktop, tablet, and mobile layouts.

## AC-14: Testing

Critical backend services and API routes have automated tests.

## AC-15: Documentation

The repository contains setup instructions, environment configuration, API documentation, and this specification.

---

# 17. DEVELOPMENT MILESTONES

Development must proceed incrementally.

## Milestone 1: Project Foundation

Deliver:

* React application.
* Express server.
* MongoDB connection.
* Environment configuration.
* Health endpoint.
* Initial routing.
* Basic responsive design system.

Acceptance:
The frontend and backend run locally, and the backend can connect to MongoDB.

## Milestone 2: Mystery Creation

Deliver:

* Creation form.
* Request validation.
* Gemini service.
* Structured generation prompt.
* Output schema.
* Generation endpoint.
* Basic generation status interface.

Acceptance:
A valid scenario can produce a structured mystery.

## Milestone 3: Investigation Experience

Deliver:

* Investigation page.
* Suspect board.
* Evidence board.
* Evidence detail views.
* Persisted case loading.
* Investigation progress.

Acceptance:
The user can investigate a generated case without seeing the solution.

## Milestone 4: Accusation and Verdict

Deliver:

* Accusation interface.
* Server-side verdict evaluation.
* Final solution page.
* Scoring.
* Duplicate-submission protection.

Acceptance:
The user can complete a case and receive a consistent verdict.

## Milestone 5: Notes and Case History

Deliver:

* Investigation notes.
* Case listing.
* Case status.
* Continue investigation.
* Ownership controls.

Acceptance:
Users can revisit their own saved cases.

## Milestone 6: Media and Polish

Deliver:

* Optional AI-generated images.
* Evidence thumbnails.
* Loading and empty states.
* Responsive refinements.
* Accessibility improvements.

Acceptance:
The experience remains functional when media generation is unavailable.

## Milestone 7: Testing and Deployment

Deliver:

* Automated tests.
* Security review.
* Error monitoring.
* Deployment configuration.
* Production environment variables.
* Updated README.

Acceptance:
The application passes the critical acceptance tests in a deployed environment.

---

# 18. CODEX DEVELOPMENT RULES

Codex must treat `SPEC.md` as the primary source of truth.

## 18.1 Before Writing Code

Codex must:

1. Read `SPEC.md` completely.
2. Inspect the existing repository.
3. Identify the current framework, dependencies, and implemented features.
4. Compare the repository with the specification.
5. Identify missing functionality.
6. Propose a small, ordered implementation plan.
7. Avoid replacing working code without a clear reason.

If the repository already contains working components, preserve and extend them when practical.

## 18.2 During Implementation

Codex must:

* Follow the specified architecture.
* Use TypeScript consistently if selected for the project.
* Keep API routes, business logic, database models, and AI integration separate.
* Use reusable React components.
* Validate API requests and Gemini output.
* Protect secret solution fields.
* Keep API credentials server-side.
* Add error handling.
* Write tests for critical functionality.
* Avoid hardcoded production secrets.
* Avoid placeholder implementations that appear complete but do not work.
* Avoid generating unused files or unnecessary abstractions.

## 18.3 Specification Compliance

When implementing a feature, Codex must identify the corresponding requirement or acceptance criterion.

If a requested feature conflicts with `SPEC.md`, Codex must:

1. Identify the conflict.
2. Explain its impact.
3. Suggest the smallest reasonable specification change.
4. Update `SPEC.md` when the new decision is approved.
5. Implement the feature against the updated specification.

Do not silently introduce conflicting behavior.

## 18.4 Completion Reporting

After each implementation task, Codex must report:

* What was implemented.
* Which requirements were satisfied.
* Which files changed.
* Which tests were executed.
* Whether the tests passed.
* Any remaining limitations.
* Any environment variables or manual setup required.

Do not claim that a feature works unless it has been implemented and appropriately tested.

---

# 19. DEFINITION OF DONE

A feature is complete only when:

1. Its expected behavior is implemented.
2. Input validation is present.
3. Errors are handled.
4. Data persistence works where required.
5. Authorization is enforced where required.
6. The UI is usable and responsive.
7. Critical automated tests pass.
8. The implementation follows the specification.
9. No secrets or private solutions are exposed.
10. Documentation is updated where necessary.

The project is not considered complete merely because the website renders or the Gemini API returns text.

The complete experience must work from mystery creation through evidence investigation to final verdict.

---

# 20. FUTURE ENHANCEMENTS

Potential future features include:

* AI-generated character portraits.
* AI-generated scene images.
* Optional generated video evidence.
* Evidence relationships visualized on a detective board.
* Contextual hints with penalties.
* Difficulty adaptation.
* Mystery sharing.
* Multiplayer investigations.
* Public mystery library.
* User ratings and feedback.
* More detailed scoring.
* Saved investigation sessions.
* Optional AI detective assistant that discusses evidence without revealing the solution.
* Additional model providers.
* Usage quotas and subscription plans.

Future features must not compromise solution secrecy or the integrity of the case.

---

# 21. FINAL PROJECT PRINCIPLES

The following principles take precedence over implementation convenience:

1. **Consistency first:** The mystery solution must be established before investigation begins.
2. **Server authority:** The backend is the source of truth for cases, accusations, verdicts, and scores.
3. **Solution secrecy:** Private solution data must not reach the client before case completion.
4. **Persistent evidence:** Generated evidence must be saved and remain stable.
5. **AI is not trusted by default:** Validate all generated output.
6. **Graceful degradation:** The core experience must work without optional image or video generation.
7. **Security by design:** Protect credentials, user data, and private cases.
8. **Incremental development:** Build and test one milestone at a time.
9. **Specification-driven changes:** Update the specification when product requirements change.
10. **Functional completeness:** Prioritize a fully working investigation experience over unnecessary features.

---

**END OF SPECIFICATION**

This document is the primary product and technical reference for AI Mystery Room.

All implementation decisions should be consistent with this specification. Any approved change to product behavior, API contracts, data models, security rules, or acceptance criteria must be reflected in `SPEC.md`.
