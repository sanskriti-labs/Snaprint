import assert from "node:assert";
import { EAApiError } from "./easyAppointments";

async function main() {
  // getAvailableSlots throws EAApiError when EA_API_KEY is unset
  delete process.env.EA_API_KEY;
  const { getAvailableSlots } = await import("./easyAppointments");
  try {
    await getAvailableSlots("2026-08-10");
    assert.fail("expected getAvailableSlots to throw when EA_API_KEY is unset");
  } catch (err) {
    assert.ok(err instanceof EAApiError, "expected EAApiError");
    assert.match((err as EAApiError).message, /EA_API_KEY is not configured/);
  }

  console.log("easyAppointments.selfcheck: OK");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
