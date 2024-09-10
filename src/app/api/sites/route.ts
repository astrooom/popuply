
import { NextResponse, type NextRequest } from "next/server";
import { rateLimitByIp } from "@/lib/ratelimit";
import { getErrorMessage } from "@/lib/error";
import { createSite } from "@/lib/api/sites";
type CreateSiteBody = {
  domain: string
}

export const POST = async (request: NextRequest) => {
  try {
    await rateLimitByIp({ key: "site-create", limit: 5, window: 60000 });
    const body: CreateSiteBody = await request.json();
    await createSite(body);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 });
  }
};
