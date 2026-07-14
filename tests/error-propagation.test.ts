import { describe, it, expect, vi, beforeEach } from "vitest";
import { ipc } from "@/lib/ipc";

/**
 * Regression tests for error propagation in IPC → dialog flow.
 *
 * The dialog catch block must handle both:
 *   - Error instances (e.g., new Error("timeout"))
 *   - CommandError plain objects ({ code, message }) thrown by ipc.ts
 *   - Unknown shapes (falls back to generic message)
 */

function simulateDialogCatch(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  } else if (typeof err === "object" && err !== null && "message" in err) {
    return String((err as { message: unknown }).message);
  } else {
    return "Failed to propose trade";
  }
}

describe("Dialog error propagation", () => {
  it("extracts message from Error instances", () => {
    const err = new Error("Network timeout");
    expect(simulateDialogCatch(err)).toBe("Network timeout");
  });

  it("extracts message from CommandError plain objects (ipc.ts contract)", () => {
    const err = { code: "API_ERROR", message: "HTTP 401: Invalid access token" };
    expect(simulateDialogCatch(err)).toBe("HTTP 401: Invalid access token");
  });

  it("extracts message from CommandError with missing code", () => {
    const err = { message: "Bad Request" };
    expect(simulateDialogCatch(err)).toBe("Bad Request");
  });

  it("falls back to generic message for null", () => {
    expect(simulateDialogCatch(null)).toBe("Failed to propose trade");
  });

  it("falls back for string throws", () => {
    expect(simulateDialogCatch("oops")).toBe("Failed to propose trade");
  });

  it("falls back for undefined", () => {
    expect(simulateDialogCatch(undefined)).toBe("Failed to propose trade");
  });

  it("handles empty message string from CommandError", () => {
    const err = { code: "API_ERROR", message: "" };
    expect(simulateDialogCatch(err)).toBe("");
  });
});

describe("IPC real error shape", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  it("ipc.trade.propose throws CommandError on non-ok response", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: () => Promise.resolve(JSON.stringify({ error: "Invalid access token" })),
    } as Response);

    // Set partyId so the ipc.trade.propose function uses it in the body
    // @ts-expect-error accessing internal state for test
    ipc.wallet.connect({ wallet_provider: "test", participant_url: "Alice" });

    try {
      await ipc.trade.propose({
        acceptor: "Bob",
        notional: 1_000_000,
        fixed_rate: 0.05,
        effective_date: "2026-07-13",
        maturity_date: "2027-07-13",
      });
      expect.fail("should have thrown");
    } catch (err) {
      const cmdErr = err as { code: string; message: string };
      expect(cmdErr.code).toBe("API_ERROR");
      expect(cmdErr.message).toContain("Invalid access token");
    }
  });

  it("ipc.trade.propose throws CommandError with HTTP status on non-JSON error", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: () => Promise.resolve("Internal Server Error"),
    } as Response);

    // @ts-expect-error accessing internal state for test
    ipc.wallet.connect({ wallet_provider: "test", participant_url: "Alice" });

    try {
      await ipc.trade.propose({
        acceptor: "Bob",
        notional: 1_000_000,
        fixed_rate: 0.05,
        effective_date: "2026-07-13",
        maturity_date: "2027-07-13",
      });
      expect.fail("should have thrown");
    } catch (err) {
      const cmdErr = err as { code: string; message: string };
      expect(cmdErr.code).toBe("API_ERROR");
      expect(cmdErr.message).toContain("HTTP 500");
      expect(cmdErr.message).toContain("Internal Server Error");
    }
  });
});
