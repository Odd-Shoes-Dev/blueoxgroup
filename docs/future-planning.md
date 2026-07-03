# Future Planning (deferred scope, not built)

The original vision for this site included a full referral/commission system:
sales reps bring in clients, track their onboarding and revenue status, and
earn commissions. This was deliberately descoped from the initial build — see
`architecture.md` and the plan history for why (trust/dispute risk, unclear
commission model, data-accuracy dependency on external systems). These notes
capture the earlier design so the group doesn't have to re-derive it later.

## Possible future data model

- **companies** — Blue Ox Group member companies: name, description, logo,
  is_active, deleted_at.
- **products** — company_id (FK), name, description, is_active, deleted_at.
- **clients** — id, referred_by (sales_profile FK), company_id/product_id (FK),
  name, contact info, status (`lead` \| `onboarded` \| `active` \| `churned`),
  is_active, deleted_at, timestamps.
- **client_revenue_events** — client_id (FK), amount, occurred_at — money
  brought in over time, feeding commission calculation.
- **commission_rules** — id, name, type (`flat` \| `percentage` \| `points` \|
  `tenure`), config (JSONB, rule-specific parameters), is_active, deleted_at.
  Kept generic/JSONB since the commission model isn't fixed — new rule types
  are added as evaluators without a schema rewrite.
- **commission_entries** — sales_profile_id (FK), client_id (FK, nullable for
  tenure/points-based), rule_id (FK), amount, status (`pending` \| `approved`
  \| `paid`), occurred_at, deleted_at. The audit trail an admin reviews/approves.

## Open questions to resolve before building this

- **Data accuracy**: onboarding/revenue status has to originate from the
  portfolio companies' own systems (billing, CRM). Without an integration,
  someone manually enters this data — decide who, how often, and what happens
  when it's late or wrong, before commissions depend on it.
- **Attribution**: how to prevent duplicate claims on the same client, and how
  long a referring rep stays "attributed" to a client's ongoing revenue.
- **Disputes & clawbacks**: what happens when a commissioned client churns
  right after payout, or two reps both claim credit.
- **Commission model**: flat per-client vs. percentage-of-revenue vs.
  points/goals vs. tenure-based — user has indicated this may combine
  multiple factors (points/goals attained, tenure) rather than a single formula.
- **Payouts**: tracking commission is different from paying it out (Stripe
  Connect, manual transfer, etc.) — not designed yet.
- **Legal/compliance**: paying commissions to non-employees likely has
  contractor/1099-style tax implications, possibly multi-jurisdiction if reps
  are international.

## Build order (when picked back up)

1. `companies` + `products` CRUD (admin-only), public showcase pages.
2. `clients` CRUD: sales rep creates/tracks referred clients, status transitions.
3. `commission_rules` + `commission_entries`: start with one evaluator (e.g.
   flat-per-onboarded-client), built to be extended.
4. Extend the admin dashboard with client/commission views and approvals.
