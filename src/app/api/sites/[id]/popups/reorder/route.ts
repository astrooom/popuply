
import { NextResponse, type NextRequest } from "next/server";
import { rateLimitByIp } from "@/lib/ratelimit";
import { getErrorMessage } from "@/lib/error";
import { reorderPopups } from "@/lib/api/popups";
import { PopupsReorder } from "@/db/schema";
import { serverLogger } from "@/lib/utils/server/logging";

export const PATCH = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {

    await rateLimitByIp({ key: "popup-reorder", limit: 5, window: 60000 });

    serverLogger.info({ type: "API", msg: "Received request to reorder popups", details: { params } });

    const { id: siteId } = params;
    if (!siteId) {
      throw new Error("Missing site id");
    }

    const reorder: PopupsReorder = await request.json();

    await reorderPopups({ siteId, reorderPopups: reorder });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 });
  }

}