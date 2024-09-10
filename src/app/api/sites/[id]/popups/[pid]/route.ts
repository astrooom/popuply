
import { NextResponse, type NextRequest } from "next/server";
import { rateLimitByIp } from "@/lib/ratelimit";
import { getErrorMessage } from "@/lib/error";
import { deletePopup, editPopup } from "@/lib/api/popups";
import { serverLogger } from "@/lib/utils/server/logging";
import { deleteFile, processImageData, uploadFile } from "@/lib/api/bunnycdn";
import { ENV_NAME } from "@/lib/constants";
import type { PopupUpdate } from "@/db/schema";

export const PATCH = async (request: NextRequest, { params }: { params: { id: string, pid: string } }) => {

  let imagePath: string | null = null;

  try {

    serverLogger.info({ type: "API", msg: "Received request to edit popup", details: { params } });

    await rateLimitByIp({ key: "popup-edit", limit: 5, window: 60000 });

    const { id, pid } = params;

    if (!id) {
      throw new Error("Missing site id")
    }

    if (!pid) {
      throw new Error("Missing popup id");
    }

    const { title, content, timestamp, link_url, theme, image }: PopupUpdate & { image?: string } = await request.json();

    // If image is included (is inclued as a data url)
    if (image) {
      const processedImageBuffer = await processImageData(image); // Processes and converts to webp.
      imagePath = `${ENV_NAME}/${pid}.webp`
      await uploadFile({
        path: imagePath,
        file: processedImageBuffer,
        purge: true
      });
    }

    const updatedPopup: PopupUpdate = {
      id: pid,
      title: title || null,
      content: content || null,
      timestamp: timestamp || null,
      link_url: link_url || null,
      theme: theme || "light",
      icon_url: imagePath || undefined
    };

    await editPopup({
      siteId: id,
      popup: updatedPopup,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {

    serverLogger.error({ type: "API", msg: "Failed to edit popup", details: { error } });

    // Delete image off of bunnycdn if exists
    if (imagePath) {
      await deleteFile(imagePath);
    }

    return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 });
  }
};


export const DELETE = async (request: NextRequest, { params }: { params: { id: string, pid: string } }) => {
  try {
    await rateLimitByIp({ key: "popup-delete", limit: 5, window: 60000 });
    const { id, pid } = params;
    if (!id) {
      throw new Error("Missing site id")
    }

    if (!pid) {
      throw new Error("Missing popup id");
    }

    await deletePopup({ siteId: id, popupId: pid });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 });
  }
}