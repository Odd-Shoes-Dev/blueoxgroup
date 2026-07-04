"use server"

import { db } from "@/lib/providers/database"

export interface SalesProfile {
  id: string
  userId: string
  fullName: string
  phoneNumber: string
  location: string
  educationLevel: string | null
  avatarUrl: string | null
  isActive: boolean
  activeStatusUpdatedAt: string
  languages: string[]
}

export async function getProfileByUserId(userId: string): Promise<SalesProfile | null> {
  const rows = await db.sql`
    select
      p.id,
      p.user_id,
      p.full_name,
      p.phone_number,
      p.location,
      p.education_level,
      p.avatar_url,
      p.is_active,
      p.active_status_updated_at
    from sales_profiles p
    where p.user_id = ${userId}
      and p.deleted_at is null
    limit 1
  `

  const row = rows[0] as
    | {
        id: string
        user_id: string
        full_name: string
        phone_number: string
        location: string
        education_level: string | null
        avatar_url: string | null
        is_active: boolean
        active_status_updated_at: string
      }
    | undefined

  if (!row) return null

  const langRows = await db.sql`
    select language
    from sales_profile_languages
    where sales_profile_id = ${row.id}
      and deleted_at is null
    order by created_at
  `

  return {
    id: row.id,
    userId: row.user_id,
    fullName: row.full_name,
    phoneNumber: row.phone_number,
    location: row.location,
    educationLevel: row.education_level,
    avatarUrl: row.avatar_url,
    isActive: row.is_active,
    activeStatusUpdatedAt: row.active_status_updated_at,
    languages: (langRows as { language: string }[]).map((r) => r.language),
  }
}
