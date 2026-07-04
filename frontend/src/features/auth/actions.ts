"use server"

import bcrypt from "bcryptjs"

import { db } from "@/lib/providers/database"
import { signIn, requireRole, getCurrentUser } from "@/lib/providers/auth"
import { revalidatePath } from "next/cache"
import { signInSchema, signUpSchema, completeProfileSchema, type SignUpInput, type CompleteProfileInput } from "./schemas"

export type ActionResult =
  | { ok: true }
  | { ok: false; message: string; fieldErrors?: Record<string, string[]> }

const SALT_ROUNDS = 12

export async function signUpAction(input: SignUpInput): Promise<ActionResult> {
  const parsed = signUpSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const { fullName, email, password, phoneNumber, dateOfBirth, location, educationLevel, languages } =
    parsed.data

  const existing = await db.sql`select id from users where email = ${email} limit 1`
  if (existing.length > 0) {
    return {
      ok: false,
      message: "An account with this email already exists.",
      fieldErrors: { email: ["An account with this email already exists."] },
    }
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
  const userId = crypto.randomUUID()
  const profileId = crypto.randomUUID()

  await db.transaction((sql) => [
    sql`
      insert into users (id, email, password_hash, role)
      values (${userId}, ${email}, ${passwordHash}, 'sales_rep')
    `,
    sql`
      insert into sales_profiles
        (id, user_id, full_name, phone_number, date_of_birth, location, education_level)
      values
        (${profileId}, ${userId}, ${fullName}, ${phoneNumber}, ${dateOfBirth}, ${location}, ${educationLevel})
    `,
    ...languages.map(
      (language) =>
        sql`insert into sales_profile_languages (sales_profile_id, language) values (${profileId}, ${language})`
    ),
  ])

  await signIn("credentials", { email, password, redirect: false })

  return { ok: true }
}

export async function signInAction(input: { email: string; password: string }): Promise<ActionResult> {
  const parsed = signInSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  try {
    await signIn("credentials", { ...parsed.data, redirect: false })
  } catch {
    // Check if this account exists but has no password (Google-only account)
    const rows = await db.sql`
      select password_hash from users where email = ${parsed.data.email} and deleted_at is null limit 1
    `
    const user = rows[0] as { password_hash: string | null } | undefined
    if (user && !user.password_hash) {
      return {
        ok: false,
        message: "This account was created with Google. Use 'Continue with Google' to sign in.",
      }
    }
    return { ok: false, message: "Invalid email or password." }
  }

  return { ok: true }
}

export async function completeProfileAction(input: CompleteProfileInput): Promise<ActionResult> {
  const user = await getCurrentUser()
  if (!user) return { ok: false, message: "You must be signed in to complete your profile." }

  const parsed = completeProfileSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const { fullName, phoneNumber, dateOfBirth, location, educationLevel, languages } = parsed.data

  const existing = await db.sql`
    select id from sales_profiles where user_id = ${user.id} and deleted_at is null limit 1
  `
  if (existing.length > 0) return { ok: true }

  const profileId = crypto.randomUUID()

  await db.transaction((sql) => [
    sql`
      insert into sales_profiles
        (id, user_id, full_name, phone_number, date_of_birth, location, education_level)
      values
        (${profileId}, ${user.id}, ${fullName}, ${phoneNumber}, ${dateOfBirth}, ${location}, ${educationLevel ?? null})
    `,
    ...languages.map(
      (language) =>
        sql`insert into sales_profile_languages (sales_profile_id, language) values (${profileId}, ${language})`
    ),
  ])

  revalidatePath("/dashboard")
  return { ok: true }
}
