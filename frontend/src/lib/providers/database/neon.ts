import { neon, type NeonQueryFunction } from "@neondatabase/serverless"

export type Row = Record<string, unknown>

function getConnectionString(): string {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.local.example to .env.local and set it to your Neon connection string."
    )
  }
  return url
}

let cached: NeonQueryFunction<false, false> | undefined

function client(): NeonQueryFunction<false, false> {
  if (!cached) {
    cached = neon(getConnectionString())
  }
  return cached
}

/**
 * Tagged-template query helper: sql`select * from users where id = ${id}`.
 * Values are parameterized automatically by the underlying driver.
 */
export const sql: NeonQueryFunction<false, false> = ((...args: Parameters<NeonQueryFunction<false, false>>) =>
  client()(...args)) as NeonQueryFunction<false, false>

/**
 * Runs multiple queries as a single non-interactive Postgres transaction.
 * Pass an array of query promises built from `sql\`...\``, e.g.:
 *   await transaction([sql`update ...`, sql`insert ...`])
 */
export const transaction: NeonQueryFunction<false, false>["transaction"] = (queriesOrFn, opts) =>
  client().transaction(queriesOrFn as never, opts)
