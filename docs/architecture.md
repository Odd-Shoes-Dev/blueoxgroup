# Architecture
# Last updated on 5th July
## Overview

The Blue Ox Group website is a Next.js application (`frontend/`) with a Postgres
database hosted on Neon. There is currently no separate backend service — all
server-side logic runs as Next.js API routes / server actions. `backend/` is a
reserved, empty placeholder for a future Express service (see `backend/README.md`).

## Core principles       

1. **No direct third-party calls from feature code.** Every third-party
   integration (database, auth providers, etc.) is accessed through a small
   interface in `frontend/src/lib/providers/`. Feature code imports the
   interface, never the underlying SDK. This means swapping Neon for another
   Postgres host, or adding another auth provider, means writing a new
   implementation behind the same interface — not touching every caller.
   See `providers.md` for details.

2. **Feature modules are decoupled.** Code lives under
   `frontend/src/features/<feature-name>/` and each feature exposes a small
   public API (its server actions / exported functions). Other features and
   pages depend only on that public surface, not on a feature's internals
   (its own DB queries, types, components). This means a bug or refactor
   inside one feature shouldn't require changes in another.

   Current features:
   - `marketing/` — public pages (home, about, showcase)
   - `auth/` — sign up, sign in, session handling (wraps `lib/providers/auth`)
   - `sales-profile/` — a sales rep's own profile CRUD + active/inactive toggle
   - `admin/` — directory dashboard over all sales profiles (reads through
     `sales-profile`'s public functions, not the DB directly)

3. **No hard deletes.** Every table has a `deleted_at TIMESTAMPTZ NULL`
   column. "Deleting" a row means setting `deleted_at = now()`; every read
   query filters `WHERE deleted_at IS NULL` unless explicitly including
   deleted rows (e.g. an admin "show deleted" view, if ever built). There are
   no `DELETE FROM` statements anywhere in application code — this is a hard
   rule, not a convention to be relaxed for convenience.

4. **Activation is not deletion.** Where a row represents something that can
   be temporarily unavailable (e.g. a sales rep going inactive), that's a
   separate `is_active` boolean, not `deleted_at`. Deactivating a profile
   doesn't remove it from admin's view; soft-deleting does.

## Database migrations

SQL migrations live in `database/migrations/`, numbered sequentially
(`0001_init.sql`, `0002_...sql`, ...). They are **run manually** against Neon
(via the Neon SQL console or `psql`) — there is no migration runner wired
into the app. See `setup.md` for how to apply a migration and
`database-schema.md` for the current schema.
