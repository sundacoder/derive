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

    fetchSpy = vi.fn((url: string) => {
      if (String(url).includes("/v2/state/ledger-end")) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ offset: 42 }),
          text: () => Promise.resolve(""),
        });
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            transaction: { updateId: "u1", events: [] },
          }),
        text: () => Promise.resolve(""),
      });
    });
    vi.stubGlobal("fetch", fetchSpy);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it("sends Authorization Bearer header on submitCreate", async () => {
    const { submitCreate } = await import("@/lib/canton/client");
    await submitCreate(["Alice"], "#derive-templates:Templates.Trade:TradeProposal", {
      proposer: "Alice",
      acceptor: "Bob",
      notional: "1000000",
      fixedRate: "0.05",
    });

    const callUrl = fetchSpy.mock.calls[0][0];
    const callHeaders = fetchSpy.mock.calls[0][1].headers;

    expect(callUrl).toContain("/v2/commands/submit-and-wait-for-transaction");
    expect(callHeaders["Authorization"]).toBe(`Bearer ${FAKE_TOKEN}`);
  });

  it("sends Authorization Bearer header on submitExercise", async () => {
    const { submitExercise } = await import("@/lib/canton/client");
    await submitExercise(
      ["Bob"],
      "#derive-templates:Templates.Trade:TradeProposal",
      "cid-123",
      "Accept",
      {}
    );

    const callHeaders = fetchSpy.mock.calls[0][1].headers;
    expect(callHeaders["Authorization"]).toBe(`Bearer ${FAKE_TOKEN}`);
  });

  it("queries ledger-end then active-contracts with Bearer header", async () => {
    const { queryContracts } = await import("@/lib/canton/client");
    await queryContracts(["Alice"], ["#derive-templates:Templates.Trade:DerivativeTrade"]);

    const urls = fetchSpy.mock.calls.map((c) => String(c[0]));
    expect(urls[0]).toContain("/v2/state/ledger-end");
    expect(urls[1]).toContain("/v2/state/active-contracts");

    const acsHeaders = fetchSpy.mock.calls[1][1].headers;
    expect(acsHeaders["Authorization"]).toBe(`Bearer ${FAKE_TOKEN}`);
  });

  it("uses correct submit-and-wait-for-transaction request shape", async () => {
    const { submitCreate } = await import("@/lib/canton/client");
    await submitCreate(["Alice"], "#derive-templates:Templates.Trade:TradeProposal", {
      proposer: "Alice",
    });

    const body = JSON.parse(fetchSpy.mock.calls[0][1].body);
    expect(body).toHaveProperty("commands");
    expect(body.commands).toHaveProperty("commandId");
    expect(body.commands.actAs).toEqual(["Alice"]);
    expect(Array.isArray(body.commands.commands)).toBe(true);
    expect(body.commands.commands[0]).toHaveProperty("CreateCommand");
    expect(body.commands.commands[0].CreateCommand).toHaveProperty("templateId");
    expect(body.commands.commands[0].CreateCommand).toHaveProperty("createArguments");
  });

  it("uses correct active-contracts request shape", async () => {
    const { queryContracts } = await import("@/lib/canton/client");
    await queryContracts(["Alice"], ["#derive-templates:Templates.Trade:DerivativeTrade"]);

    const body = JSON.parse(fetchSpy.mock.calls[1][1].body);
    expect(body).toHaveProperty("activeAtOffset", 42);
    expect(body).toHaveProperty("verbose", true);
    const partyFilter = body.filter.filtersByParty["Alice"];
    expect(partyFilter.cumulative[0].identifierFilter.TemplateFilter.value.templateId).toBe(
      "#derive-templates:Templates.Trade:DerivativeTrade"
    );
  });

  it("parses created contracts out of the transaction events", async () => {
    fetchSpy.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            transaction: {
              updateId: "u2",
              events: [
                {
                  CreatedEvent: {
                    contractId: "cid-created-1",
                    templateId: "pkg:Templates.Trade:TradeProposal",
                    createArgument: { proposer: "Alice" },
                  },
                },
              ],
            },
          }),
        text: () => Promise.resolve(""),
      })
    );

    const { submitCreate } = await import("@/lib/canton/client");
    const result = await submitCreate(
      ["Alice"],
      "#derive-templates:Templates.Trade:TradeProposal",
      { proposer: "Alice" }
    );

    expect(result.contracts?.[0].contractId).toBe("cid-created-1");
    expect(result.contracts?.[0].payload).toEqual({ proposer: "Alice" });
    expect(result.update?.transactionId).toBe("u2");
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
    const result = await submitCreate(["Alice"], "#derive-templates:Templates.Trade:TradeProposal", {
      proposer: "Alice",
      acceptor: "Bob",
      notional: "1000000",
      fixedRate: "0.05",
    });

    expect(result.status).toBe(401);
    expect(result.error).toContain("Invalid access token");
  });
});
