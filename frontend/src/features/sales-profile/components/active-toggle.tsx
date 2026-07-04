"use client"

import { useTransition } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { toggleActiveAction } from "../actions"

interface ActiveToggleProps {
  isActive: boolean
}

export function ActiveToggle({ isActive }: ActiveToggleProps) {
  const [isPending, startTransition] = useTransition()

  function handleToggle() {
    startTransition(async () => {
      const result = await toggleActiveAction()
      if (!result.ok) {
        toast.error(result.message)
        return
      }
      toast.success(isActive ? "You are now marked as inactive." : "You are now marked as active.")
    })
  }

  return (
    <div className={`flex items-center gap-4 rounded-lg border p-4 transition-colors ${isActive ? "border-brand-orange/30 bg-brand-orange-light" : ""}`}>
      <div className="flex-1">
        <p className="text-sm font-medium">Availability status</p>
        <p className="text-sm text-muted-foreground">
          {isActive
            ? "You are currently active — admins can see you're available."
            : "You are currently inactive — set yourself active when you're available for new clients."}
        </p>
      </div>
      <Button
        variant={isActive ? "outline" : "default"}
        onClick={handleToggle}
        disabled={isPending}
        className="shrink-0"
      >
        {isPending ? "Updating…" : isActive ? "Set inactive" : "Set active"}
      </Button>
    </div>
  )
}
