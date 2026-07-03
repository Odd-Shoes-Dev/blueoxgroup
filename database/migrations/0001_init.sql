-- 0001_init.sql
-- Run manually against the Neon database (no ORM/migration runner).
-- Creates: users, sales_profiles, sales_profile_languages.
-- Convention: no hard deletes anywhere. Every table has deleted_at for soft delete.

CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT,                 -- nullable: null if the user only ever signs in with Google
  role          TEXT NOT NULL DEFAULT 'sales_rep' CHECK (role IN ('admin', 'sales_rep')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at    TIMESTAMPTZ
);

CREATE TABLE sales_profiles (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL UNIQUE REFERENCES users(id),
  full_name               TEXT NOT NULL,
  phone_number            TEXT NOT NULL,
  date_of_birth           DATE NOT NULL,        -- used only to verify age >= 18 at signup
  location                TEXT NOT NULL,        -- district/region, free text for now
  education_level         TEXT,
  is_active               BOOLEAN NOT NULL DEFAULT false,
  active_status_updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at              TIMESTAMPTZ
);

CREATE TABLE sales_profile_languages (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sales_profile_id  UUID NOT NULL REFERENCES sales_profiles(id),
  language          TEXT NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at        TIMESTAMPTZ,
  UNIQUE (sales_profile_id, language)
);

CREATE INDEX idx_sales_profiles_user_id ON sales_profiles(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_sales_profiles_location ON sales_profiles(location) WHERE deleted_at IS NULL;
CREATE INDEX idx_sales_profiles_is_active ON sales_profiles(is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_sales_profile_languages_profile_id ON sales_profile_languages(sales_profile_id) WHERE deleted_at IS NULL;
