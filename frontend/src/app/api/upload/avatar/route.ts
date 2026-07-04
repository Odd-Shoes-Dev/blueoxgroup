import { NextResponse } from "next/server"

import { getCurrentUser } from "@/lib/providers/auth"
import { uploadImage } from "@/lib/providers/storage"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"]
const MAX_BYTES = 5 * 1024 * 1024 // 5 MB

export async function POST(request: Request) {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ message: "Invalid form data." }, { status: 400 })
  }

  const file = formData.get("file")
  if (!(file instanceof File)) {
    return NextResponse.json({ message: "No file provided." }, { status: 400 })
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { message: "Only JPEG, PNG, and WebP images are allowed." },
      { status: 400 }
    )
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { message: "Image must be 5 MB or smaller." },
      { status: 400 }
    )
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const ext = file.type.split("/")[1]
  const fileName = `avatar-${user.id}-${Date.now()}.${ext}`

  try {
    const result = await uploadImage(buffer, fileName, file.type)
    return NextResponse.json({ url: result.url, fileId: result.fileId })
  } catch (err) {
    console.error("Avatar upload error:", err)
    return NextResponse.json(
      { message: "Upload failed. Please try again." },
      { status: 500 }
    )
  }
}
