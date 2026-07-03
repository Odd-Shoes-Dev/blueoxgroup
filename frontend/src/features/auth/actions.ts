"use server"

import bcrypt from "bcryptjs"

import { db } from "@/lib/providers/database"
import { signIn } from "@/lib/providers/auth"
import { signInSchema, signUpSchema, type SignUpInput } from "./schemas"

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
    return { ok: false, message: "Invalid email or password." }
  }

  return { ok: true }
}
