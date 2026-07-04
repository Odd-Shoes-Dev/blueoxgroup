-- 0003_add_suspended_role.sql
-- Adds 'suspended' as a valid role value.
-- Run manually against the Neon database.

ALTER TABLE users
  DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE users
  ADD CONSTRAINT users_role_check
  CHECK (role IN ('admin', 'sales_rep', 'suspended'));
