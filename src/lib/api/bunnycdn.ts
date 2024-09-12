import "server-only"

import sharp from "sharp"
import { serverLogger } from "../utils/server/logging"
import {
  BUNNYCDN_ZONE_API_KEY,
  BUNNYCDN_API_URL,
  BUNNYCDN_STORAGE_URL,
  BUNNYCDN_ACCOUNT_API_KEY,
} from "../constants/server/bunnycdn.server"
import { BUNNYCDN_PULLZONE_URL, BUNNYCDN_STORAGE_ZONE } from "../constants/bunnycdn"
import { withQuery } from "ufo"

export const processImageData = async (image: string) => {
  // Remove the data URL prefix
  const base64Data = image.replace(/^data:image\/\w+;base64,/, "")

  // Convert base64 to buffer
  const buffer = Buffer.from(base64Data, "base64")

  // Process the image with Sharp
  return await sharp(buffer)
    .webp({ quality: 60 }) // Convert to WebP and compress
    .resize({ width: 64, height: 64, fit: "inside" }) // Resize if needed
    .toBuffer()
}

export const uploadFile = async ({ path, file, purge }: { path: string; file: Buffer; purge?: boolean }) => {
  const uploadFileUrl = `${BUNNYCDN_STORAGE_URL}/${BUNNYCDN_STORAGE_ZONE}/${path}`

  serverLogger.info({ type: "API", msg: "Uploading file", details: { path, uploadFileUrl } })

  try {
    await fetch(uploadFileUrl, {
      method: "PUT",
      headers: {
        AccessKey: BUNNYCDN_ZONE_API_KEY as string,
        "Content-Type": "application/octet-stream",
      },
      body: file,
    })
  } catch (error) {
    serverLogger.error({ type: "API", msg: "Error uploading file", details: { path, error } })
    throw error
  }

  if (purge) {
    // Purge cache on bunnycdn for this file
    const purgeFileUrl = withQuery(`${BUNNYCDN_API_URL}/purge`, {
      url: `${BUNNYCDN_PULLZONE_URL}/${path}`,
    })

    try {
      const response = await fetch(purgeFileUrl, {
        method: "POST",
        headers: {
          AccessKey: BUNNYCDN_ACCOUNT_API_KEY as string,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        serverLogger.error({
          type: "API",
          msg: "Error purging file. Ignoring.",
          details: { path, purgeFileUrl, status: response.status, response: await response.json() },
        })
      } else {
        serverLogger.info({ type: "API", msg: "Purged file", details: { path, purgeFileUrl } })
      }
    } catch (error) {
      serverLogger.error({ type: "API", msg: "Error purging file. Ignoring.", details: { path, error } })
    }
  }
}

export const deleteFile = async (path: string) => {
  const deleteFileUrl = `${BUNNYCDN_STORAGE_URL}/${BUNNYCDN_STORAGE_ZONE}/${path}`

  serverLogger.info({ type: "API", msg: "Deleting file", details: { path, deleteFileUrl } })

  try {
    await fetch(deleteFileUrl, {
      method: "DELETE",
      headers: {
        AccessKey: BUNNYCDN_ZONE_API_KEY as string,
      },
    })
  } catch (error) {
    serverLogger.error({ type: "API", msg: "Error deleting file", details: { path, error } })
    throw error
  }
}
