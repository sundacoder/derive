import { CANTON_LEDGER_API_URL } from "./config";

export interface CantonCommandResult {
  status: number;
  events?: CantonEvent[];
  error?: string;
}

export interface CantonEvent {
  eventType: "created" | "archived" | "exercised";
  contractId?: string;
  templateId?: string;
  createArguments?: Record<string, unknown>;
  choice?: string;
  exerciseResult?: unknown;
  signatories?: string[];
  observers?: string[];
  contractKey?: Record<string, unknown>;
}

export interface LedgerCommandRequest {
  actAs: string[];
  readAs?: string[];
  commands: LedgerCommand[];
  commandId?: string;
  workflowId?: string;
}

export type LedgerCommand =
  | {
      commandType: "create";
      templateId: string;
      createArguments: Record<string, unknown>;
    }
  | {
      commandType: "exercise";
      templateId: string;
      contractId: string;
      choice: string;
      choiceArgument: Record<string, unknown>;
    };

function buildCommandId(): string {
  return `derive-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function submitCreate(
  actAs: string[],
  templateId: string,
  createArguments: Record<string, unknown>,
): Promise<CantonCommandResult> {
  const body: LedgerCommandRequest = {
    actAs,
    commands: [{ commandType: "create", templateId, createArguments }],
    commandId: buildCommandId(),
  };

  const res = await fetch(`${CANTON_LEDGER_API_URL}/v2/commands/submit-and-wait`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    return { status: res.status, error: text };
  }

  const data = await res.json();
  return { status: res.status, events: data.events };
}

export async function submitExercise(
  actAs: string[],
  templateId: string,
  contractId: string,
  choice: string,
  choiceArgument: Record<string, unknown> = {},
): Promise<CantonCommandResult> {
  const body: LedgerCommandRequest = {
    actAs,
    commands: [{ commandType: "exercise", templateId, contractId, choice, choiceArgument }],
    commandId: buildCommandId(),
  };

  const res = await fetch(`${CANTON_LEDGER_API_URL}/v2/commands/submit-and-wait`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    return { status: res.status, error: text };
  }

  const data = await res.json();
  return { status: res.status, events: data.events };
}

export async function queryContracts(
  actAs: string[],
  filter: { templateId?: string } = {},
): Promise<CantonCommandResult> {
  const body: { actAs: string[]; filter?: { templateId?: string } } = { actAs };
  if (filter.templateId) {
    body.filter = { templateId: filter.templateId };
  }

  const res = await fetch(`${CANTON_LEDGER_API_URL}/v2/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    return { status: res.status, error: text };
  }

  const data = await res.json();
  return { status: res.status, events: data.events ?? data.result };
}

function extractCreatedContract(
  events: CantonEvent[] | undefined,
): { contractId: string; arguments: Record<string, unknown> } | null {
  if (!events) return null;
  const created = events.find((e) => e.eventType === "created");
  if (!created?.contractId) return null;
  return { contractId: created.contractId, arguments: created.createArguments ?? {} };
}

function extractExerciseResult(
  events: CantonEvent[] | undefined,
): { contractId: string; result: unknown } | null {
  if (!events) return null;
  const exercised = events.find((e) => e.eventType === "exercised");
  if (!exercised?.contractId) return null;
  return { contractId: exercised.contractId, result: exercised.exerciseResult };
}

export const extract = { createdContract: extractCreatedContract, exerciseResult: extractExerciseResult };
