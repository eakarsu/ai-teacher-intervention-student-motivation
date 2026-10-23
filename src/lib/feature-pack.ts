// Pure offline helpers: no provider calls. Labelled sections preserve false/0/empty.
export function displayValue(value: unknown): string {
  if (value === false) return "false";
  if (value === 0) return "0";
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}
export function labelledSections(row: Record<string, unknown>, labels?: string[]) {
  return (labels ?? Object.keys(row ?? {})).map((label) => ({ label, value: displayValue(row?.[label]), raw: row?.[label] ?? null }));
}
export function filterRecords<T extends Record<string, unknown>>(rows: T[], opts: { q?: string; status?: string } = {}): T[] {
  const needle = String(opts.q ?? "").trim().toLowerCase();
  return (rows ?? []).filter((row) => {
    if (opts.status && String(row.status ?? "") !== opts.status) return false;
    if (!needle) return true;
    return Object.values(row ?? {}).some((v) => displayValue(v).toLowerCase().includes(needle));
  });
}
export function fallbackAnalysis(domainLabel: string, rows: Record<string, unknown>[], kind = "priorities") {
  const list = rows ?? [];
  const open = list.filter((r) => !["Closed", "Approved", "closed"].includes(String(r.status ?? "")));
  return {
    aiGenerated: false, source: "deterministic-fallback", label: "Deterministic fallback — not AI-generated", kind,
    headline: `Intervention priorities — ${domainLabel}`,
    summary: `Deterministic review of ${list.length} own record(s); ${open.length} open. No provider was called.`,
    findings: [`${list.length} record(s) reviewed`, `${open.length} open record(s) need follow-up`],
    recommendations: ["Review the first open student intervention.", "Assign an accountable teacher owner.", "Record the guardian follow-up evidence."],
    sections: [
      { title: "Records reviewed", detail: `${list.length} record(s) reviewed; ${open.length} open.` },
      { title: "Next step", detail: open.length ? `Start with: ${open.slice(0, 3).map((r) => String(r.name ?? r.title ?? r.id)).join(", ")}` : "No open records. Export the list for evidence." },
    ],
    metrics: [{ label: "Records reviewed", value: displayValue(list.length) }, { label: "Open records", value: displayValue(open.length) }],
  };
}
export const FALLBACK_KINDS = ["priorities", "evidence-gaps", "summary"];
