"use client"

import { useRef, useState, useTransition } from "react"
import { CameraIcon, Loader2Icon } from "lucide-react"
import { toast } from "sonner"

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar"
import { updateAvatarAction } from "../actions"

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "?"
  return ((parts[0][0] ?? "") + (parts[parts.length - 1][0] ?? "")).toUpperCase()
}

interface AvatarUploadProps {
  name: string
  currentUrl: string | null
  onUploadSuccess?: (url: string) => void
}

export function AvatarUpload({ name, currentUrl, onUploadSuccess }: AvatarUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl)
  const [isUploading, startUpload] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const allowed = ["image/jpeg", "image/png", "image/webp"]
    if (!allowed.includes(file.type)) {
      toast.error("Only JPEG, PNG, or WebP images are allowed.")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be 5 MB or smaller.")
      return
    }

    startUpload(async () => {
      const body = new FormData()
      body.append("file", file)

      const res = await fetch("/api/upload/avatar", { method: "POST", body })
      const data = (await res.json()) as { url?: string; message?: string }

      if (!res.ok) {
        toast.error(data.message ?? "Upload failed.")
        return
      }

      const result = await updateAvatarAction(data.url!)
      if (!result.ok) {
        toast.error(result.message)
        return
      }

      setPreviewUrl(data.url!)
      onUploadSuccess?.(data.url!)
      toast.success("Profile photo updated.")
    })

    // reset input so the same file can be re-selected
    e.target.value = ""
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="group relative cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Change profile photo"
      >
        <Avatar size="lg" className="size-20">
          {previewUrl && <AvatarImage src={previewUrl} alt={name} />}
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>

        <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          {isUploading ? (
            <Loader2Icon className="size-5 animate-spin text-white" />
          ) : (
            <CameraIcon className="size-5 text-white" />
          )}
        </span>
      </button>

      <p className="text-xs text-muted-foreground">
        {isUploading ? "Uploading…" : "Click to change photo"}
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}
