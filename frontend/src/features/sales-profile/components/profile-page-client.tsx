"use client"

import { useState } from "react"
import { PencilIcon, PhoneIcon, MailIcon, GraduationCapIcon } from "lucide-react"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import type { SalesProfile } from "../queries"
import type { UpdateProfileInput } from "../schemas"
import { ProfileForm } from "./profile-form"
import { ActiveToggle } from "./active-toggle"

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "?"
  return ((parts[0][0] ?? "") + (parts[parts.length - 1][0] ?? "")).toUpperCase()
}

interface ProfilePageClientProps {
  profile: SalesProfile
  email: string
}

export function ProfilePageClient({ profile: initialProfile, email }: ProfilePageClientProps) {
  const [mode, setMode] = useState<"view" | "edit">("view")
  const [profile, setProfile] = useState(initialProfile)

  function handleSaved(values: UpdateProfileInput & { avatarUrl: string | null }) {
    setProfile((prev) => ({
      ...prev,
      fullName: values.fullName,
      phoneNumber: values.phoneNumber,
      location: values.location,
      educationLevel: values.educationLevel ?? null,
      languages: values.languages,
      avatarUrl: values.avatarUrl,
    }))
    setMode("view")
  }

  return (
    <div className="grid max-w-xl gap-6">
      <ActiveToggle isActive={profile.isActive} />

      {mode === "view" ? (
        <div className="grid gap-5 rounded-xl border bg-card p-6">
          {/* Avatar + name + edit */}
          <div className="flex items-start gap-4">
            <Avatar className="size-16 shrink-0">
              {profile.avatarUrl && (
                <AvatarImage src={profile.avatarUrl} alt={profile.fullName} />
              )}
              <AvatarFallback className="text-lg">{getInitials(profile.fullName)}</AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-semibold leading-tight">{profile.fullName}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{profile.location}</p>
              <div className="mt-2">
                {profile.isActive ? (
                  <Badge
                    className="text-xs"
                    style={{
                      backgroundColor: "var(--brand-orange-light)",
                      color: "var(--brand-orange-dark)",
                      borderColor: "color-mix(in oklch, var(--brand-orange) 20%, transparent)",
                    }}
                  >
                    Active
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    Inactive
                  </Badge>
                )}
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={() => setMode("edit")}>
              <PencilIcon className="size-3.5" />
              Edit
            </Button>
          </div>

          {/* Contact & details */}
          <div className="grid gap-2.5 border-t pt-4 text-sm">
            <div className="flex items-center gap-2.5">
              <PhoneIcon className="size-4 shrink-0 text-muted-foreground" />
              <span>{profile.phoneNumber}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <MailIcon className="size-4 shrink-0 text-muted-foreground" />
              <span className="truncate">{email}</span>
            </div>
            {profile.educationLevel && (
              <div className="flex items-center gap-2.5">
                <GraduationCapIcon className="size-4 shrink-0 text-muted-foreground" />
                <span>{profile.educationLevel}</span>
              </div>
            )}
          </div>

          {/* Languages */}
          {profile.languages.length > 0 && (
            <div className="border-t pt-4">
              <p className="font-utility mb-2 text-xs uppercase tracking-widest text-muted-foreground">
                Languages
              </p>
              <div className="flex flex-wrap gap-1.5">
                {profile.languages.map((lang) => (
                  <Badge key={lang} variant="secondary" className="text-xs">
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border bg-card p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Edit profile</h2>
            <Button variant="ghost" size="sm" onClick={() => setMode("view")}>
              Cancel
            </Button>
          </div>
          <ProfileForm profile={profile} onSaved={handleSaved} />
        </div>
      )}
    </div>
  )
}
