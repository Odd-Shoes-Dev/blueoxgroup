function getConfig() {
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY
  const folder = process.env.IMAGEKIT_APP_FOLDER

  if (!urlEndpoint || !publicKey || !privateKey || !folder) {
    throw new Error(
      "Missing ImageKit configuration. Set IMAGEKIT_URL_ENDPOINT, IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_APP_FOLDER in your environment."
    )
  }

  return { urlEndpoint, publicKey, privateKey, folder }
}

export interface UploadResult {
  url: string
  fileId: string
  filePath: string
}

export async function uploadImage(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<UploadResult> {
  const { privateKey, folder } = getConfig()

  const formData = new FormData()
  formData.append("file", new Blob([new Uint8Array(fileBuffer)], { type: mimeType }), fileName)
  formData.append("fileName", fileName)
  formData.append("folder", folder)
  formData.append("useUniqueFileName", "true")

  const auth = Buffer.from(`${privateKey}:`).toString("base64")

  const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    headers: { Authorization: `Basic ${auth}` },
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error((error as { message?: string }).message ?? "ImageKit upload failed")
  }

  const data = (await response.json()) as { url: string; fileId: string; filePath: string }
  return { url: data.url, fileId: data.fileId, filePath: data.filePath }
}

export async function deleteImage(fileId: string): Promise<void> {
  const { privateKey } = getConfig()
  const auth = Buffer.from(`${privateKey}:`).toString("base64")

  await fetch(`https://api.imagekit.io/v1/files/${fileId}`, {
    method: "DELETE",
    headers: { Authorization: `Basic ${auth}` },
  })
}
