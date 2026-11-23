# Security Specification — Pulse OCTO Studio Firestore Rules

## 1. Data Invariants
1. **Owner-Only Mutations (Verified Email Required):** Only a verified owner/admin (`request.auth != null && request.auth.token.email_verified == true && (request.auth.token.email == 'pulseocto0o@gmail.com' || exists(/admins/$(request.auth.uid)))`) can create, update, or delete `studioProjects`, `studioAssets`, or `studioAssets/{assetId}/chunks`. Public visitors have read-only access to published portfolio showcase documents (`studioProjects` & `studioAssets`) which contain zero PII.
2. **Relational & Master Gate Integrity:** A `StudioAssetChunk` under `/studioAssets/{assetId}/chunks/{chunkId}` cannot exist or be modified unless its parent `/studioAssets/{assetId}` document exists and is owned/managed by an authorized admin.
3. **Immutable Ownership & Timestamps:** `ownerUid` and `createdAt` are set strictly at creation (`ownerUid == request.auth.uid`, `createdAt == request.time`) and can never be mutated on update. `updatedAt` must always equal `request.time`.
4. **Anti-Denial-of-Wallet & Strict Schemas:** Every document ID (`projectId`, `assetId`, `chunkId`) must pass `^[a-zA-Z0-9_-]+$` and `size <= 128`. Every string has bounded `.size()`, and documents reject unapproved/shadow fields via `keys().hasOnly(...)` and `affectedKeys().hasOnly(...)`.

## 2. The "Dirty Dozen" Attack Payloads (Must Return PERMISSION_DENIED)
1. **Unauthenticated Create (`studioProjects`):** Anonymous request attempts `setDoc('/studioProjects/athar', ...)` -> Denied (`isAdmin()` false).
2. **Unverified Admin Email Spoof:** Authenticated user with `email: 'pulseocto0o@gmail.com'` and `email_verified: false` attempts write -> Denied (`email_verified == true` required).
3. **Non-Admin Signed-In User:** Authenticated Google user `attacker@gmail.com` (`email_verified: true`) attempts to overwrite `studioProjects/athar` -> Denied.
4. **Shadow Field Injection on Create:** Verified admin attempts to create `studioAssets/asset_1` with an undeclared field `isFeaturedHack: true` -> Denied (`keys().hasOnly(...)`).
5. **Shadow Field Injection on Update:** Verified admin attempts partial update adding undeclared field `adminOverride: true` -> Denied (`affectedKeys().hasOnly(...)`).
6. **Timestamp Spoofing (Create):** Attempt to set `createdAt` or `updatedAt` to a client-supplied past/future Timestamp instead of `request.time` -> Denied.
7. **Immutable Field Mutation (`ownerUid` / `createdAt`):** Verified admin attempts to change `ownerUid` or `createdAt` on an existing `studioProjects` doc -> Denied.
8. **Invalid Document ID Poisoning:** Attempt to create `/studioProjects/../../../etc/passwd` or a 200-char ID -> Denied (`isValidId()` fails).
9. **Oversized Payload / String Exhaustion:** Attempt to store a >900,000-byte `dataUrl` string or >200-char `fileName` -> Denied (`.size()` check).
10. **Wrong `kind` Enum:** Attempt to create `studioProjects/test` with `kind: "arbitrary"` instead of `'override'` or `'custom'` -> Denied.
11. **Orphaned PDF Chunk (Master Gate Bypass):** Attempt to write `/studioAssets/missing_parent/chunks/0` when parent `/studioAssets/missing_parent` does not exist -> Denied (`exists(...)` fails).
12. **Privilege Escalation (`/admins/{uid}`):** Non-admin attempts to create `/admins/{theirUid}` -> Denied (default-deny / verified-admin-only).
