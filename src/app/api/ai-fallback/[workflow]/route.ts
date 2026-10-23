import { NextRequest } from "next/server";
import { authorize } from "@/lib/api-auth";
import { workflows } from "@/config/app";
import { RequestError } from "@/lib/record-policy";
import { errorResponse } from "@/lib/record-store";
import { fallbackAnalysis } from "@/lib/feature-pack";
export const dynamic = "force-dynamic";
// Deterministic offline fallback over caller-supplied own records; never calls a provider.
export async function POST(request: NextRequest, context: { params: Promise<{ workflow: string }> }) {
  try {
    await authorize("write");
    const { workflow } = await context.params;
    const config = workflows.find((w) => w.slug === workflow);
    if (!config) throw new RequestError("Unknown workflow", 404);
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const rows = Array.isArray(body.records) ? (body.records as Record<string, unknown>[]).slice(0, 200) : [];
    return Response.json({ result: fallbackAnalysis(config.title, rows, String(body.kind || "priorities")) });
  } catch (error) { return errorResponse(error); }
}
