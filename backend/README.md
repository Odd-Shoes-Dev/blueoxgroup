# Backend (reserved, not yet implemented)

This folder is a placeholder for a future Express.js service.

Right now all application logic (auth, database access, business logic) lives in
`frontend/` as Next.js API routes and server actions, behind the provider
abstraction layer in `frontend/src/lib/providers/`. There is no running code here.

This folder will be used later if/when a need arises that Next.js server actions
can't cleanly cover — for example: long-running background jobs, a service that
needs to scale independently from the frontend, or a public API consumed by
something other than this website.

When that need arises, see `docs/architecture.md` for how the frontend's
provider abstraction layer is structured, so the Express service can be
integrated without having to change how features call their providers.
