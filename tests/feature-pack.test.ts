import test from "node:test";
import assert from "node:assert/strict";
import { filterRecords, fallbackAnalysis, labelledSections } from "../src/lib/feature-pack";
import { toCsv } from "../src/lib/csv";
const rows = [{ id: "1", name: "Ana", status: "Open", amount: 0, verified: false, note: "" }, { id: "2", name: "Ben", status: "Closed", amount: 5, verified: true, note: "ok" }];
test("search/filter on main list", () => { assert.equal(filterRecords(rows, { q: "ana" }).length, 1); assert.equal(filterRecords(rows, { status: "Closed" }).length, 1); });
test("CSV export preserves rows", () => { assert.ok(toCsv(rows).includes("Ana")); });
test("fallback labelled aiGenerated:false", () => { const r = fallbackAnalysis("Gap Triage", rows); assert.equal(r.aiGenerated, false); assert.ok(r.sections.length >= 2); });
test("labelled sections preserve false/0/empty", () => { const s = labelledSections(rows[0]); assert.equal(s.find((x) => x.label === "amount")?.value, "0"); assert.equal(s.find((x) => x.label === "verified")?.value, "false"); assert.equal(s.find((x) => x.label === "note")?.value, "—"); });
