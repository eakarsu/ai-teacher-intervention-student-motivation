import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

test("start script fails closed: no swallowed migrations, secret required", () => {
  const start = readFileSync("start.sh", "utf8");
  assert.ok(!start.includes("|| true"), "start.sh must not swallow failures");
  assert.ok(start.includes("NEXTAUTH_SECRET"), "start.sh must require NEXTAUTH_SECRET");
});

test("no hard-coded demo password in app source", () => {
  for (const file of ["prisma/seed.ts", "src/app/(auth)/login/page.tsx"]) {
    if (!existsSync(file)) continue;
    const body = readFileSync(file, "utf8");
    assert.ok(!body.includes("Demo!23456"), file + " must not hard-code the demo password");
  }
});

test("health and tasks APIs exist", () => {
  assert.ok(existsSync("src/app/api/health/route.ts"));
  assert.ok(existsSync("src/app/api/tasks/route.ts"));
});
