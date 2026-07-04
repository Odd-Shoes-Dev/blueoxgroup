"use client"

import { useTransition } from "react"
import { toast } from "sonner"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { reinstateRepAction } from "../actions"
import type { SuspendedRep } from "../queries"

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "?"
  return ((parts[0][0] ?? "") + (parts[parts.length - 1][0] ?? "")).toUpperCase()
}

function ReinstateButton({ userId, name }: { userId: string; name: string }) {
  const [isPending, startTransition] = useTransition()

  function handleReinstate() {
    startTransition(async () => {
      const result = await reinstateRepAction(userId)
      if (!result.ok) toast.error(result.message)
      else toast.success(`${name} has been reinstated.`)
    })
  }

  return (
    <Button variant="outline" size="sm" onClick={handleReinstate} disabled={isPending}>
      {isPending ? "Reinstating…" : "Reinstate"}
    </Button>
  )
}

interface SuspendedUsersProps {
  reps: SuspendedRep[]
}

export function SuspendedUsers({ reps }: SuspendedUsersProps) {
  if (reps.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No suspended users.</p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/40 text-left text-xs font-medium text-muted-foreground">
            <th className="px-4 py-3">User</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {reps.map((rep) => {
            const displayName = rep.fullName ?? rep.email
            return (
              <tr key={rep.userId} className="bg-background hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar size="sm">
                      {rep.avatarUrl && <AvatarImage src={rep.avatarUrl} alt={displayName} />}
                      <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{rep.fullName ?? "—"}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{rep.email}</td>
                <td className="px-4 py-3 text-muted-foreground">{rep.location ?? "—"}</td>
                <td className="px-4 py-3">
                  <ReinstateButton userId={rep.userId} name={displayName} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
