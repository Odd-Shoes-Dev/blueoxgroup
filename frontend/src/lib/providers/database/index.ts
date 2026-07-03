import { sql, transaction } from "./neon"

/**
 * The only database interface feature code should import. Swapping the
 * underlying provider (Neon -> something else) means changing neon.ts,
 * not every caller.
 */
export const db = {
  sql,
  transaction,
}

export type { Row } from "./neon"
