import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorize } from "@/lib/api-auth";
import { recordMetadata } from "@/lib/record-policy";
import { records, errorResponse } from "@/lib/record-store";
import { toCsv, csvResponse } from "@/lib/csv";
import { filterRecords } from "@/lib/feature-pack";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ entity: string }> };
export async function GET(request: NextRequest, context: Context) {
  try {
    await authorize();
    const { entity } = await context.params;
    const client = records(prisma, entity);
    const rows = (await client.findMany({ orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: 500 })) as Record<string, unknown>[];
    const filtered = filterRecords(rows, { q: request.nextUrl.searchParams.get("q") || "", status: request.nextUrl.searchParams.get("status") || "" });
    void recordMetadata;
    if ((request.nextUrl.searchParams.get("format") || "json").toLowerCase() === "csv") return csvResponse(`${entity}-records.csv`, toCsv(filtered as never[]));
    return Response.json({ items: filtered });
  } catch (error) { return errorResponse(error); }
}
