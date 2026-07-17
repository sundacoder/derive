/**
 * Canton Ledger API v2 Client
 *
 * Implements the JSON Ledger API v2 protocol as served by Canton 3.5
 * (verified against the live 5N sandbox participant):
 *   - commands:  POST /v2/commands/submit-and-wait-for-transaction
 *   - ACS query: POST /v2/state/active-contracts (+ GET /v2/state/ledger-end)
 *   - lookup:    POST /v2/events/events-by-contract-id
 * Uses automatic token refresh via auth module.
 */

import { CANTON_LEDGER_API_URL } from "./config";
import { getAccessToken } from "./auth";

export interface CantonCommandResult {
  status: number;
  contracts?: CantonContract[];
  update?: CantonUpdate;
  error?: string;
}

export interface CantonContract {
  contractId: string;
  templateId: string;
  payload: Record<string, unknown>;
  createdAt?: string;
}

export interface CantonUpdate {
  transactionId?: string;
  effectiveAt?: string;
  events?: unknown[];
}

export type LedgerCommand =
  | {
      CreateCommand: {
        templateId: string;
        createArguments: Record<string, unknown>;
      };
    }
  | {
      ExerciseCommand: {
        templateId: string;
        contractId: string;
        choice: string;
        choiceArgument: Record<string, unknown>;
      };
    };

interface JsCreatedEvent {
  contractId: string;
  templateId: string;
  createArgument?: Record<string, unknown>;
  createdAt?: string;
}

interface JsTransaction {
  updateId?: string;
  effectiveAt?: string;
  events?: Array<Record<string, JsCreatedEvent>>;
}

/**
 * Build HTTP headers with Bearer token authentication
 */
async function buildHeaders(): Promise<Record<string, string>> {
  const token = await getAccessToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Generate a unique command ID for idempotency
 */
function buildCommandId(): string {
  return `derive-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Per-party cumulative filter used by ACS queries and event lookups.
 * Template IDs must be package-name references (#pkg-name:Module:Entity);
 * the ledger rejects raw package-ID references in filters.
 */
function buildFiltersByParty(
  parties: string[],
  templateIds?: string[],
): Record<string, unknown> {
  const cumulative =
    templateIds && templateIds.length > 0
      ? templateIds.map((templateId) => ({
          identifierFilter: {
            TemplateFilter: { value: { templateId, includeCreatedEventBlob: false } },
          },
        }))
      : [
          {
            identifierFilter: {
              WildcardFilter: { value: { includeCreatedEventBlob: false } },
            },
          },
        ];
  return Object.fromEntries(parties.map((p) => [p, { cumulative }]));
}

async function submitCommand(
  parties: string[],
  command: LedgerCommand,
): Promise<CantonCommandResult> {
  const body = {
    commands: {
      commands: [command],
      commandId: buildCommandId(),
      actAs: parties,
    },
  };

  try {
    const headers = await buildHeaders();
    const res = await fetch(
      `${CANTON_LEDGER_API_URL}/v2/commands/submit-and-wait-for-transaction`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      },
    );

    if (!res.ok) {
      const text = await res.text();
      return { status: res.status, error: text };
    }

    const data = await res.json();
    const transaction: JsTransaction = data.transaction ?? {};

    return {
      status: res.status,
      contracts: extractCreatedFromTransaction(transaction),
      update: {
        transactionId: transaction.updateId,
        effectiveAt: transaction.effectiveAt,
        events: transaction.events,
      },
    };
  } catch (error) {
    return {
      status: 500,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Submit a create command to the ledger
 */
export async function submitCreate(
  parties: string[],
  templateId: string,
  createArguments: Record<string, unknown>,
): Promise<CantonCommandResult> {
  return submitCommand(parties, { CreateCommand: { templateId, createArguments } });
}

/**
 * Submit an exercise command to the ledger
 */
export async function submitExercise(
  parties: string[],
  templateId: string,
  contractId: string,
  choice: string,
  choiceArgument: Record<string, unknown> = {},
): Promise<CantonCommandResult> {
  return submitCommand(parties, {
    ExerciseCommand: { templateId, contractId, choice, choiceArgument },
  });
}

/**
 * Query contracts from the ACS (Active Contract Set)
 */
export async function queryContracts(
  parties: string[],
  templateIds: string[],
): Promise<CantonCommandResult> {
  try {
    const { ledgerEnd, error: offsetError } = await getLedgerEnd();
    if (offsetError) {
      return { status: 502, error: offsetError };
    }

    const body = {
      filter: { filtersByParty: buildFiltersByParty(parties, templateIds) },
      verbose: true,
      activeAtOffset: ledgerEnd,
    };

    const headers = await buildHeaders();
    const res = await fetch(`${CANTON_LEDGER_API_URL}/v2/state/active-contracts`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      return { status: res.status, error: text };
    }

    const entries: Array<{
      contractEntry?: { JsActiveContract?: { createdEvent?: JsCreatedEvent } };
    }> = await res.json();

    const contracts = entries
      .map((e) => e.contractEntry?.JsActiveContract?.createdEvent)
      .filter((ev): ev is JsCreatedEvent => Boolean(ev?.contractId))
      .map(mapCreatedEvent);

    return { status: res.status, contracts };
  } catch (error) {
    return {
      status: 500,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Look up a specific contract by ID
 */
export async function lookupContract(
  parties: string[],
  contractId: string,
): Promise<CantonCommandResult> {
  const body = {
    contractId,
    eventFormat: {
      filtersByParty: buildFiltersByParty(parties),
      verbose: true,
    },
  };

  try {
    const headers = await buildHeaders();
    const res = await fetch(`${CANTON_LEDGER_API_URL}/v2/events/events-by-contract-id`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      return { status: res.status, error: text };
    }

    const data = await res.json();
    const createdEvent: JsCreatedEvent | undefined = data.created?.createdEvent;
    if (!createdEvent?.contractId) {
      return { status: 404, error: "Contract not found or not visible to party" };
    }

    return { status: res.status, contracts: [mapCreatedEvent(createdEvent)] };
  } catch (error) {
    return {
      status: 500,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Get the current ledger end offset (used for ACS synchronization)
 */
export async function getLedgerEnd(): Promise<{ ledgerEnd: number; error?: string }> {
  try {
    const headers = await buildHeaders();
    const res = await fetch(`${CANTON_LEDGER_API_URL}/v2/state/ledger-end`, {
      method: "GET",
      headers,
    });

    if (!res.ok) {
      const text = await res.text();
      return { ledgerEnd: 0, error: text };
    }

    const data = await res.json();
    return { ledgerEnd: data.offset ?? 0 };
  } catch (error) {
    return {
      ledgerEnd: 0,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function mapCreatedEvent(ev: JsCreatedEvent): CantonContract {
  return {
    contractId: ev.contractId,
    templateId: ev.templateId,
    payload: ev.createArgument ?? {},
    createdAt: ev.createdAt,
  };
}

/**
 * Extract created contracts from a transaction's events
 */
function extractCreatedFromTransaction(transaction: JsTransaction): CantonContract[] {
  if (!transaction.events) return [];
  return transaction.events
    .map((e) => e.CreatedEvent)
    .filter((ev): ev is JsCreatedEvent => Boolean(ev?.contractId))
    .map(mapCreatedEvent);
}

/**
 * Helper to extract the first created contract from a result
 */
export function extractCreatedContract(
  result: CantonCommandResult,
): { contractId: string; payload: Record<string, unknown> } | null {
  if (!result.contracts || result.contracts.length === 0) return null;
  const created = result.contracts[0];
  return { contractId: created.contractId, payload: created.payload };
}

export const extract = { createdContract: extractCreatedContract };
