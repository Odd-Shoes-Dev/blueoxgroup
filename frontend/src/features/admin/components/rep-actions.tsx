"use client"

import { useTransition } from "react"
import { MoreVerticalIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
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
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Actions"
            disabled={isPending}
          />
        }
      >
        <MoreVerticalIcon className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        {isActive && (
          <DropdownMenuItem onClick={handleDeactivate}>
            Deactivate
          </DropdownMenuItem>
        )}
        <DropdownMenuItem variant="destructive" onClick={handleDelete}>
          Remove
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
