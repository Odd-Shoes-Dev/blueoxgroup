"use client"

import { useTransition } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { deactivateRepAction, softDeleteRepAction } from "../actions"

interface RepActionsProps {
  profileId: string
  isActive: boolean
  fullName: string
}

export function RepActions({ profileId, isActive, fullName }: RepActionsProps) {
  const [isPending, startTransition] = useTransition()

  function handleDeactivate() {
    startTransition(async () => {
      const result = await deactivateRepAction(profileId)
      if (!result.ok) toast.error(result.message)
      else toast.success(`${fullName} has been deactivated.`)
    })
  }

  function handleDelete() {
    if (!confirm(`Remove ${fullName} from the directory? This cannot be undone easily.`)) return
    startTransition(async () => {
      const result = await softDeleteRepAction(profileId)
      if (!result.ok) toast.error(result.message)
      else toast.success(`${fullName} has been removed.`)
    })
  }

  return (
    <div className="flex items-center gap-2">
      {isActive && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleDeactivate}
          disabled={isPending}
        >
          Deactivate
        </Button>
      )}
      <Button
        variant="destructive"
        size="sm"
        onClick={handleDelete}
        disabled={isPending}
      >
        Remove
      </Button>
    </div>
  )
}
