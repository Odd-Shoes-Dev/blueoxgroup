# Provider Abstraction Layer

## Why

Every third-party dependency (database host, auth providers, and anything
added later — email, file storage, etc.) is wrapped behind a small interface
in `frontend/src/lib/providers/`. Feature code never imports a third-party
SDK directly. This means:

- Swapping Neon for another Postgres provider (or a different DB entirely)
  means writing a new implementation of the DB interface — not touching every
  feature that queries data.
- Adding a new auth method, or replacing NextAuth, is isolated to
  `lib/providers/auth/`.
- If a provider has an outage or bug, the blast radius is contained to one
  file, not scattered across every feature that happens to use it.

## Structure

```
frontend/src/lib/providers/
  database/
    index.ts   # the interface features import: query(), transaction(), etc.
    neon.ts    # Neon-specific implementation (@neondatabase/serverless)
  auth/
    index.ts   # re-exports the configured NextAuth instance + helpers
                # (getCurrentUser(), requireRole())
    config.ts  # NextAuth options: Credentials provider + Google provider
```

## Rule

If you find yourself writing `import { neon } from '@neondatabase/serverless'`
or `import { ... } from 'next-auth'` anywhere outside `lib/providers/`, that's
a signal the code belongs in the provider layer instead. Feature code imports
from `@/lib/providers/database` or `@/lib/providers/auth`, never the raw SDK.

## Adding a new provider (e.g. email later)

1. Create `frontend/src/lib/providers/email/index.ts` defining the interface
   (e.g. `sendEmail(to, subject, body)`).
2. Create `frontend/src/lib/providers/email/<provider-name>.ts` implementing it.
3. `index.ts` exports the configured implementation.
4. Feature code imports from `@/lib/providers/email`, never the raw SDK.
