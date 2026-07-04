"use client"

import { useState, useMemo } from "react"
import { LayoutGridIcon, ListIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RepCard } from "./rep-card"
import { RepsTable } from "./reps-table"
import type { RepRow } from "../queries"

interface RepsDirectoryProps {
  reps: RepRow[]
  currentUserId: string
}

export function RepsDirectory({ reps, currentUserId }: RepsDirectoryProps) {
  const [location, setLocation] = useState("")
  const [language, setLanguage] = useState("")
  const [status, setStatus] = useState<"" | "active" | "inactive">("")
  const [view, setView] = useState<"grid" | "list">("grid")

  const filtered = useMemo(() => {
    return reps.filter((rep) => {
      if (location && !rep.location.toLowerCase().includes(location.toLowerCase())) return false
      if (language && !rep.languages.some((l) => l.toLowerCase().includes(language.toLowerCase()))) return false
      if (status === "active" && !rep.isActive) return false
      if (status === "inactive" && rep.isActive) return false
      return true
    })
  }, [reps, location, language, status])

  const activeCount = filtered.filter((r) => r.isActive).length

  return (
    <div className="grid gap-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl uppercase tracking-[0.08em]" style={{ color: "var(--brand-blue)" }}>Representatives</h1>
          <p className="mt-1 font-utility text-xs text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "rep" : "reps"}
            {location || language || status ? " match filters" : " total"}
            {activeCount > 0 && ` — ${activeCount} active`}
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 rounded-lg border p-1">
          <Button
            variant={view === "grid" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setView("grid")}
            className="size-7 p-0"
            aria-label="Card view"
          >
            <LayoutGridIcon className="size-4" />
          </Button>
          <Button
            variant={view === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setView("list")}
            className="size-7 p-0"
            aria-label="List view"
          >
            <ListIcon className="size-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Filter by location…"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-48"
        />
        <Input
          placeholder="Filter by language…"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-48"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "" | "active" | "inactive")}
          className="h-8 rounded-lg border border-border bg-background px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {(location || language || status) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setLocation("")
              setLanguage("")
              setStatus("")
            }}
          >
            Clear
          </Button>
        )}
      </div>

      {/* Results */}
      {view === "grid" ? (
        filtered.length === 0 ? (
          <div className="flex h-40 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
            No representatives match your filters.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((rep) => (
              <RepCard key={rep.profileId} rep={rep} isSelf={rep.userId === currentUserId} />
            ))}
          </div>
        )
      ) : (
        <RepsTable reps={filtered} currentUserId={currentUserId} />
      )}
    </div>
  )
}
