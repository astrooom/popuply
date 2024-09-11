import { NextRequest, NextResponse } from "next/server";
import { externalGetSite } from "@/lib/api/sites";
import { rateLimitByIp } from "@/lib/ratelimit";
import { getErrorMessage } from "@/lib/error";
import { headers } from "next/headers";

export const GET = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {

    await rateLimitByIp({ key: "external-site-get", limit: 8, window: 60000 });

    const { id } = params;

    if (!id) {
      throw new Error("Missing site id");
    }

    const headersList = headers();
    const host = headersList.get('x-forwarded-host') || headersList.get('host')

    if (!host) {
      throw new Error("Missing host");
    }

    return NextResponse.json({ data: await externalGetSite({ siteId: id, host }) }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 });
  }
};
