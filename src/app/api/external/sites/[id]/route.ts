import { NextRequest, NextResponse } from "next/server";
import { externalGetSite } from "@/lib/api/sites";
import { rateLimitByIp } from "@/lib/ratelimit";
import { getErrorMessage } from "@/lib/error";

export const GET = async (request: NextRequest, { params }: { params: { id: string } }) => {
  try {

    await rateLimitByIp({ key: "external-site-get", limit: 8, window: 60000 });

    const { id } = params;

    if (!id) {
      throw new Error("Missing site id");
    }

    return NextResponse.json({ data: await externalGetSite({ siteId: id }) }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: getErrorMessage(error) }, { status: 400 });
  }
};
