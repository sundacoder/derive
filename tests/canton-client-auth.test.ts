import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

const FAKE_TOKEN = "test-jwt-token.eyJwYXJ0eUlkIjoiQWxpY2UifQ.signature";

// Mock the auth module to avoid real token fetching
vi.mock("@/lib/canton/auth", () => ({
  getAccessToken: vi.fn(() => Promise.resolve(FAKE_TOKEN)),
  refreshToken: vi.fn(() => Promise.resolve(FAKE_TOKEN)),
  hasValidToken: vi.fn(() => true),
  getTokenExpiry: vi.fn(() => Date.now() + 8 * 60 * 60 * 1000),
}));

describe("Canton Ledger API client", () => {
  let fetchSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.stubEnv("CANTON_LEDGER_API_URL", "https://ledger.example.com");
    vi.stubEnv("CANTON_PACKAGE_ID", "pkg123");
    vi.stubEnv("CANTON_CLIENT_ID", "test-client");
    vi.stubEnv("CANTON_CLIENT_SECRET", "test-secret");

    fetchSpy = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ contracts: [], update: { events: [] } }),
        text: () => Promise.resolve(""),
      })
    );
    vi.stubGlobal("fetch", fetchSpy);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("sends Authorization Bearer header on submitCreate", async () => {
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

  it("sends Authorization Bearer header on submitExercise", async () => {
    const { submitExercise } = await import("@/lib/canton/client");
    await submitExercise(
      ["Bob"],
      "pkg123:Templates.Trade:TradeProposal",
      "cid-123",
      "Accept",
      {}
    );

    const callHeaders = fetchSpy.mock.calls[0][1].headers;
    expect(callHeaders["Authorization"]).toBe(`Bearer ${FAKE_TOKEN}`);
  });

  it("sends Authorization Bearer header on queryContracts", async () => {
    const { queryContracts } = await import("@/lib/canton/client");
    await queryContracts(["Alice"], ["pkg123:Templates.Trade:DerivativeTrade"]);

    const callUrl = fetchSpy.mock.calls[0][0];
    const callHeaders = fetchSpy.mock.calls[0][1].headers;

    expect(callUrl).toContain("/v2/contracts/search");
    expect(callHeaders["Authorization"]).toBe(`Bearer ${FAKE_TOKEN}`);
  });

  it("uses correct submit-and-wait request shape", async () => {
    const { submitCreate } = await import("@/lib/canton/client");
    await submitCreate(["Alice"], "pkg123:Templates.Trade:TradeProposal", {
      proposer: "Alice",
    });

    const body = JSON.parse(fetchSpy.mock.calls[0][1].body);
    expect(body).toHaveProperty("parties");
    expect(body).toHaveProperty("command");
    expect(body.command).toHaveProperty("create");
    expect(body.command.create).toHaveProperty("templateId");
    expect(body.command.create).toHaveProperty("createArguments");
  });

  it("uses correct contract search request shape", async () => {
    const { queryContracts } = await import("@/lib/canton/client");
    await queryContracts(["Alice"], ["pkg123:Templates.Trade:DerivativeTrade"]);

    const body = JSON.parse(fetchSpy.mock.calls[0][1].body);
    expect(body).toHaveProperty("parties");
    expect(body).toHaveProperty("templateIds");
    expect(Array.isArray(body.templateIds)).toBe(true);
  });

  it("propagates error body when ledger returns 401", async () => {
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


