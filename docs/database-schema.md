# Database Schema

Source of truth for structure is `database/migrations/`. This doc describes
the schema in prose and should be updated whenever a new migration is added.

## Conventions

- Every table has `deleted_at TIMESTAMPTZ NULL` — soft delete only, no hard deletes.
- Every table has `created_at` / `updated_at` (except `sales_profile_languages`,
  which only needs `created_at` since language rows are added/removed, not edited).
- Primary keys are UUIDs (`gen_random_uuid()`).

## Tables (as of `0001_init.sql`)

### `users`
Authentication identity. Both NextAuth Credentials (email/password) and Google
sign-in resolve to a row here, matched by `email`.

| column        | notes                                              |
|---------------|-----------------------------------------------------|
| id            | UUID PK                                              |
| email         | unique, used for both auth methods                    |
| password_hash | null if the user only ever signs in via Google          |
| role          | `admin` \| `sales_rep`                                    |
| deleted_at    | soft delete                                                |

### `sales_profiles`
A sales rep's directory entry. 1:1 with a `users` row.

| column                    | notes                                                        |
|---------------------------|----------------------------------------------------------------|
| id                        | UUID PK                                                          |
| user_id                   | FK -> users.id, unique (1:1)                                       |
| full_name                 |                                                                       |
| phone_number              | contact info admins use to reach the rep                              |
| date_of_birth             | collected only to verify age >= 18 at signup; not surfaced beyond that |
| location                  | district/region, free text                                              |
| education_level           | free text                                                                  |
| is_active                 | availability toggle, set by the rep themselves                              |
| active_status_updated_at  | when `is_active` last changed — lets admins see how stale a status is         |
| deleted_at                | soft delete (admin-only action)                                                 |

### `sales_profile_languages`
A rep can speak multiple languages, so this is a child table rather than a
single column on `sales_profiles`.

| column           | notes                              |
|------------------|--------------------------------------|
| id               | UUID PK                                |
| sales_profile_id | FK -> sales_profiles.id                  |
| language         | free text, unique per (profile, language)  |
| deleted_at       | soft delete                                  |

## Deferred (not yet built)

Client referral tracking, companies/products as structured data, and the
commission engine were part of the original design but are deliberately not
implemented in this phase. See `future-planning.md` for the design notes to
pick back up later.
