/**
 * Canton Ledger API v2 Client
 * 
 * Implements the JSON Ledger API v2 protocol for Canton Network.
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
  events?: CantonEvent[];
}

export interface CantonEvent {
  eventType: "created" | "exercised" | "archived";
  contractId?: string;
  templateId?: string;
  createArguments?: Record<string, unknown>;
  choice?: string;
  exerciseResult?: unknown;
}

export interface LedgerCommandRequest {
  parties: string[];
  commandId?: string;
  workflowId?: string;
  command: LedgerCommand;
}

export type LedgerCommand =
  | {
      create: {
        templateId: string;
        createArguments: Record<string, unknown>;
      };
    }
  | {
      exercise: {
        templateId: string;
        contractId: string;
        choice: string;
        choiceArgument: Record<string, unknown>;
      };
    };

export interface ContractSearchRequest {
  parties: string[];
  templateIds: string[];
  query?: Record<string, unknown>;
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
 * Submit a create command to the ledger
 */
export async function submitCreate(
  parties: string[],
  templateId: string,
  createArguments: Record<string, unknown>,
): Promise<CantonCommandResult> {
  const body: LedgerCommandRequest = {
    parties,
    commandId: buildCommandId(),
    command: {
      create: {
        templateId,
        createArguments,
      },
    },
  };

  try {
    const headers = await buildHeaders();
    const res = await fetch(`${CANTON_LEDGER_API_URL}/v2/commands/submit-and-wait`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      return { status: res.status, error: text };
    }

    const data = await res.json();
    
    // Extract contracts from the update
    const contracts = extractContractsFromUpdate(data.update);
    
    return {
      status: res.status,
      contracts,
      update: data.update,
    };
  } catch (error) {
    return {
      status: 500,
      error: error instanceof Error ? error.message : String(error),
    };
  }
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
  const body: LedgerCommandRequest = {
    parties,
    commandId: buildCommandId(),
    command: {
      exercise: {
        templateId,
        contractId,
        choice,
        choiceArgument,
      },
    },
  };

  try {
    const headers = await buildHeaders();
    const res = await fetch(`${CANTON_LEDGER_API_URL}/v2/commands/submit-and-wait`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      return { status: res.status, error: text };
    }

    const data = await res.json();
    const contracts = extractContractsFromUpdate(data.update);
    
    return {
      status: res.status,
      contracts,
      update: data.update,
    };
  } catch (error) {
    return {
      status: 500,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Query contracts from the ACS (Active Contract Set)
 */
export async function queryContracts(
  parties: string[],
  templateIds: string[],
): Promise<CantonCommandResult> {
  const body: ContractSearchRequest = {
    parties,
    templateIds,
  };

  try {
    const headers = await buildHeaders();
    const res = await fetch(`${CANTON_LEDGER_API_URL}/v2/contracts/search`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      return { status: res.status, error: text };
    }

    const data = await res.json();
    
    // Extract contracts from search response
    const contracts = data.contracts || [];
    
    return {
      status: res.status,
      contracts: contracts.map((c: any) => ({
        contractId: c.contractId,
        templateId: c.templateId,
        payload: c.payload || c.createArguments || {},
        createdAt: c.createdAt,
      })),
    };
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
    parties,
    contractId,
  };

  try {
    const headers = await buildHeaders();
    const res = await fetch(`${CANTON_LEDGER_API_URL}/v2/contracts/lookup`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      return { status: res.status, error: text };
    }

    const data = await res.json();
    
    return {
      status: res.status,
      contracts: [
        {
          contractId: data.contractId,
          templateId: data.templateId,
          payload: data.payload || data.createArguments || {},
          createdAt: data.createdAt,
        },
      ],
    };
  } catch (error) {
    return {
      status: 500,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Get the current ledger end (useful for synchronization)
 */
export async function getLedgerEnd(): Promise<{ ledgerEnd: string; error?: string }> {
  try {
    const headers = await buildHeaders();
    const res = await fetch(`${CANTON_LEDGER_API_URL}/v2/state/ledger-end`, {
      method: "GET",
      headers,
    });

    if (!res.ok) {
      const text = await res.text();
      return { ledgerEnd: "", error: text };
    }

    const data = await res.json();
    return { ledgerEnd: data.ledgerEnd || data.offset || "" };
  } catch (error) {
    return {
      ledgerEnd: "",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Extract created contracts from a transaction update
 */
function extractContractsFromUpdate(update: CantonUpdate | undefined): CantonContract[] {
  if (!update?.events) return [];
  
  return update.events
    .filter((e) => e.eventType === "created" && e.contractId && e.templateId)
    .map((e) => ({
      contractId: e.contractId!,
      templateId: e.templateId!,
      payload: e.createArguments || {},
    }));
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
