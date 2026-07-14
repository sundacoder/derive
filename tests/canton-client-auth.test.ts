import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

const FAKE_TOKEN = "test-jwt-token.eyJwYXJ0eUlkIjoiQWxpY2UifQ.signature";

describe("Canton Ledger API client auth", () => {
  let fetchSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchSpy = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ events: [] }),
        text: () => Promise.resolve(""),
        status: 200,
      })
    );
    vi.stubGlobal("fetch", fetchSpy);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("sends Authorization Bearer header when CANTON_ACCESS_TOKEN is set", async () => {
    vi.stubEnv("CANTON_LEDGER_API_URL", "https://ledger.example.com");
    vi.stubEnv("CANTON_PACKAGE_ID", "pkg123");
    vi.stubEnv("CANTON_ACCESS_TOKEN", FAKE_TOKEN);

    const { submitCreate } = await import("@/lib/canton/client");

    await submitCreate(["Alice"], "pkg123:Templates.Trade:TradeProposal", {
      proposer: "Alice",
      acceptor: "Bob",
      notional: "1000000",
      fixedRate: "0.05",
    });

    const callUrl = fetchSpy.mock.calls[0][0];
    const callHeaders = fetchSpy.mock.calls[0][1].headers;

    expect(callUrl).toContain("/v2/commands/submit-and-wait");
    expect(callHeaders["Authorization"]).toBe(`Bearer ${FAKE_TOKEN}`);
  });

  it("does not send Authorization header when CANTON_ACCESS_TOKEN is unset", async () => {
    vi.stubEnv("CANTON_LEDGER_API_URL", "https://ledger.example.com");
    vi.stubEnv("CANTON_PACKAGE_ID", "pkg123");
    vi.stubEnv("CANTON_ACCESS_TOKEN", "");

    const { submitCreate } = await import("@/lib/canton/client");

    await submitCreate(["Alice"], "pkg123:Templates.Trade:TradeProposal", {
      proposer: "Alice",
      acceptor: "Bob",
      notional: "1000000",
      fixedRate: "0.05",
    });

    const callHeaders = fetchSpy.mock.calls[0][1].headers;
    expect(callHeaders["Authorization"]).toBeUndefined();
  });

  it("applies auth header on submitExercise", async () => {
    vi.stubEnv("CANTON_LEDGER_API_URL", "https://ledger.example.com");
    vi.stubEnv("CANTON_PACKAGE_ID", "pkg123");
    vi.stubEnv("CANTON_ACCESS_TOKEN", FAKE_TOKEN);

    const { submitExercise } = await import("@/lib/canton/client");

    await submitExercise(["Bob"], "pkg123:Templates.Trade:TradeProposal", "cid-123", "Accept");

    const callHeaders = fetchSpy.mock.calls[0][1].headers;
    expect(callHeaders["Authorization"]).toBe(`Bearer ${FAKE_TOKEN}`);
  });

  it("applies auth header on queryContracts", async () => {
    vi.stubEnv("CANTON_LEDGER_API_URL", "https://ledger.example.com");
    vi.stubEnv("CANTON_PACKAGE_ID", "pkg123");
    vi.stubEnv("CANTON_ACCESS_TOKEN", FAKE_TOKEN);

    const { queryContracts } = await import("@/lib/canton/client");

    await queryContracts(["Alice"], { templateId: "pkg123:Templates.Trade:DerivativeTrade" });

    const callHeaders = fetchSpy.mock.calls[0][1].headers;
    expect(callHeaders["Authorization"]).toBe(`Bearer ${FAKE_TOKEN}`);
  });

  it("propagates error body when ledger returns 401", async () => {
    vi.stubEnv("CANTON_LEDGER_API_URL", "https://ledger.example.com");
    vi.stubEnv("CANTON_PACKAGE_ID", "pkg123");
    vi.stubEnv("CANTON_ACCESS_TOKEN", FAKE_TOKEN);

    fetchSpy.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 401,
        text: () => Promise.resolve(JSON.stringify({ code: "UNAUTHENTICATED", message: "Invalid access token" })),
      })
    );

    const { submitCreate } = await import("@/lib/canton/client");

    const result = await submitCreate(["Alice"], "pkg123:Templates.Trade:TradeProposal", {
      proposer: "Alice",
      acceptor: "Bob",
      notional: "1000000",
      fixedRate: "0.05",
    });

    expect(result.status).toBe(401);
    expect(result.error).toContain("Invalid access token");
  });
});
