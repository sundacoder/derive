/**
 * Canton Party Authorization Helpers
 * 
 * Validates that authenticated parties in X-Party-Id header are allowed to act as
 * the parties specified in the request body.
 */

import { NextRequest } from "next/server";
import { isPartyAllowed } from "@/lib/config/allowlist";

export function getAuthenticatedParty(req: NextRequest): string | null {
  return req.headers.get("X-Party-Id");
}

export function validatePartyAuthorization(
  req: NextRequest,
  requestedParties: string | string[],
): string | null {
  const authenticatedParty = getAuthenticatedParty(req);

  if (!authenticatedParty) {
    return "Missing X-Party-Id header";
  }

  if (!isPartyAllowed(authenticatedParty)) {
    return "Authenticated party is not authorized";
  }

  const parties = Array.isArray(requestedParties) ? requestedParties : [requestedParties];

  // Validate that all requested parties are on the allowlist
  for (const party of parties) {
    if (!isPartyAllowed(party)) {
      return `Party ${party} is not authorized`;
    }
  }

  // Validate that the authenticated party is one of the requested parties
  if (!parties.includes(authenticatedParty)) {
    return `Authenticated party cannot act on behalf of requested parties`;
  }

  return null;
}

export function validateAnyPartyAllowed(
  req: NextRequest,
  requestedParties: string[],
): string | null {
  const authenticatedParty = getAuthenticatedParty(req);

  if (!authenticatedParty) {
    return "Missing X-Party-Id header";
  }

  if (!isPartyAllowed(authenticatedParty)) {
    return "Authenticated party is not authorized";
  }

  for (const party of requestedParties) {
    if (!isPartyAllowed(party)) {
      return `Party ${party} is not authorized`;
    }
  }

  return null;
}
