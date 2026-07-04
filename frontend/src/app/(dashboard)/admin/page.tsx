import { redirect } from "next/navigation"
import type { Metadata } from "next"

import { requireRole } from "@/lib/providers/auth"
import { listReps, RepsTable } from "@/features/admin"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Representatives — Blue Ox Group Admin",
}

interface AdminPageProps {
  searchParams: Promise<{ location?: string; language?: string; status?: string }>
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  try {
    await requireRole("admin")
  } catch {
    redirect("/dashboard")
  }

  const params = await searchParams
  const { location, language, status } = params

  const isActiveFilter =
    status === "active" ? true : status === "inactive" ? false : undefined

  const reps = await listReps({
    location: location || undefined,
    language: language || undefined,
    isActive: isActiveFilter,
  })

  const activeCount = reps.filter((r) => r.isActive).length

  return (
    <div className="grid gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Representatives</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {reps.length} {reps.length === 1 ? "rep" : "reps"} found
          {activeCount > 0 && ` — ${activeCount} active`}
        </p>
      </div>

      <form className="flex flex-wrap gap-3" method="GET">
        <Input
          name="location"
          placeholder="Filter by location…"
          defaultValue={location ?? ""}
          className="w-48"
        />
        <Input
          name="language"
          placeholder="Filter by language…"
          defaultValue={language ?? ""}
          className="w-48"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="h-8 rounded-lg border border-border bg-background px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <Button type="submit" variant="outline" size="sm">
          Filter
        </Button>
        {(location || language || status) && (
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<a href="/admin" />}
          >
            Clear
          </Button>
        )}
      </form>

      <RepsTable reps={reps} />
    </div>
  )
}
