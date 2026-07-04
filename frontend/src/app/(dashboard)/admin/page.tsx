import { redirect } from "next/navigation"
import { LayoutGridIcon, ListIcon } from "lucide-react"
import type { Metadata } from "next"

import { requireRole } from "@/lib/providers/auth"
import { listReps, RepsTable, RepCard } from "@/features/admin"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Representatives — Blue Ox Group Admin",
}

interface AdminPageProps {
  searchParams: Promise<{
    location?: string
    language?: string
    status?: string
    view?: string
  }>
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  try {
    await requireRole("admin")
  } catch {
    redirect("/dashboard")
  }

  const params = await searchParams
  const { location, language, status, view } = params

  const isGrid = view !== "list"
  const isActiveFilter =
    status === "active" ? true : status === "inactive" ? false : undefined

  const reps = await listReps({
    location: location || undefined,
    language: language || undefined,
    isActive: isActiveFilter,
  })

  const activeCount = reps.filter((r) => r.isActive).length

  function buildUrl(overrides: Record<string, string | undefined>) {
    const merged = { location, language, status, view, ...overrides }
    const qs = Object.entries(merged)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}=${encodeURIComponent(v!)}`)
      .join("&")
    return `/admin${qs ? `?${qs}` : ""}`
  }

  return (
    <div className="grid gap-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Representatives</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {reps.length} {reps.length === 1 ? "rep" : "reps"} found
            {activeCount > 0 && ` — ${activeCount} active`}
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 rounded-lg border p-1">
          <Button
            variant={isGrid ? "secondary" : "ghost"}
            size="sm"
            nativeButton={false}
            render={<a href={buildUrl({ view: "grid" })} />}
            className="size-7 p-0"
            aria-label="Card view"
          >
            <LayoutGridIcon className="size-4" />
          </Button>
          <Button
            variant={!isGrid ? "secondary" : "ghost"}
            size="sm"
            nativeButton={false}
            render={<a href={buildUrl({ view: "list" })} />}
            className="size-7 p-0"
            aria-label="List view"
          >
            <ListIcon className="size-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <form className="flex flex-wrap gap-3" method="GET">
        {view && <input type="hidden" name="view" value={view} />}
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
            render={<a href={buildUrl({ location: undefined, language: undefined, status: undefined })} />}
          >
            Clear
          </Button>
        )}
      </form>

      {/* Results */}
      {isGrid ? (
        reps.length === 0 ? (
          <div className="flex h-40 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
            No representatives match your filters.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reps.map((rep) => (
              <RepCard key={rep.profileId} rep={rep} />
            ))}
          </div>
        )
      ) : (
        <RepsTable reps={reps} />
      )}
    </div>
  )
}
