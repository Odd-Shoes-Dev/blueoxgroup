"use server"

import { db } from "@/lib/providers/database"

export interface RepRow {
  profileId: string
  userId: string
  fullName: string
  phoneNumber: string
  email: string
  location: string
  educationLevel: string | null
  avatarUrl: string | null
  isActive: boolean
  activeStatusUpdatedAt: string
  languages: string[]
}

export interface ListRepsFilters {
  location?: string
  language?: string
  isActive?: boolean
}

export async function listReps(filters: ListRepsFilters = {}): Promise<RepRow[]> {
  // Build the query in parts; Neon's tagged-template sql doesn't support
  // conditional fragments, so we fetch all non-deleted reps and filter in JS
  // for the MVP. This is fine at the scale expected (dozens–low hundreds of reps).
  const rows = await db.sql`
    select
      p.id            as profile_id,
      p.user_id,
      p.full_name,
      p.phone_number,
      p.location,
      p.education_level,
      p.avatar_url,
      p.is_active,
      p.active_status_updated_at,
      u.email
    from sales_profiles p
    join users u on u.id = p.user_id
    where p.deleted_at is null
      and u.deleted_at is null
    order by p.full_name asc
  `

  type RawRow = {
    profile_id: string
    user_id: string
    full_name: string
    phone_number: string
    location: string
    education_level: string | null
    avatar_url: string | null
    is_active: boolean
    active_status_updated_at: string
    email: string
  }

  const profileIds = (rows as RawRow[]).map((r) => r.profile_id)

  let langMap: Record<string, string[]> = {}
  if (profileIds.length > 0) {
    const langRows = await db.sql`
      select sales_profile_id, language
      from sales_profile_languages
      where sales_profile_id = any(${profileIds}::uuid[])
        and deleted_at is null
    `
    for (const lr of langRows as { sales_profile_id: string; language: string }[]) {
      ;(langMap[lr.sales_profile_id] ??= []).push(lr.language)
    }
  }

  let result: RepRow[] = (rows as RawRow[]).map((r) => ({
    profileId: r.profile_id,
    userId: r.user_id,
    fullName: r.full_name,
    phoneNumber: r.phone_number,
    email: r.email,
    location: r.location,
    educationLevel: r.education_level,
    avatarUrl: r.avatar_url,
    isActive: r.is_active,
    activeStatusUpdatedAt: r.active_status_updated_at,
    languages: langMap[r.profile_id] ?? [],
  }))

  if (filters.location) {
    const loc = filters.location.toLowerCase()
    result = result.filter((r) => r.location.toLowerCase().includes(loc))
  }
  if (filters.language) {
    const lang = filters.language.toLowerCase()
    result = result.filter((r) => r.languages.some((l) => l.toLowerCase().includes(lang)))
  }
  if (filters.isActive !== undefined) {
    result = result.filter((r) => r.isActive === filters.isActive)
  }

  return result
}
