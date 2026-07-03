# Local Setup

## Prerequisites

- Node.js 20+ and npm
- A Neon Postgres project (https://neon.tech)
- A Google Cloud OAuth Client ID/Secret (for Google sign-in)

## 1. Install dependencies

```bash
cd frontend
npm install
```

## 2. Environment variables

Create `frontend/.env.local`:

```
DATABASE_URL=postgresql://<neon-connection-string>

AUTH_SECRET=<random string, e.g. `openssl rand -base64 32`>
AUTH_GOOGLE_ID=<google oauth client id>
AUTH_GOOGLE_SECRET=<google oauth client secret>
```

`.env.local` is gitignored by default in the Next.js template — never commit it.

## 3. Run database migrations

Migrations are **not** run automatically. Apply them manually, in order, via
the Neon SQL console (or `psql "$DATABASE_URL" -f database/migrations/0001_init.sql`):

```
database/migrations/0001_init.sql
```

## 4. Run the app

```bash
cd frontend
npm run dev
```

Visit http://localhost:3000.

## 5. Creating the first admin user

There's no UI for promoting a user to `admin` yet — sign up normally, then
manually update the row in Neon:

```sql
UPDATE users SET role = 'admin' WHERE email = 'you@example.com';
```
