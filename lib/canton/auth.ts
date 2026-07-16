/**
 * Canton Ledger API Authentication Module
 * 
 * Handles OAuth2 client credentials flow with automatic token refresh.
 * Tokens expire every 8 hours; this module refreshes them proactively.
 */

const TOKEN_ENDPOINT = "https://auth.sandbox.fivenorth.io/application/o/token/";
const CLIENT_ID = process.env.CANTON_CLIENT_ID || "validator-devnet-m2m";
const CLIENT_SECRET = process.env.CANTON_CLIENT_SECRET || "";
const AUDIENCE = process.env.CANTON_AUDIENCE || "validator-devnet-m2m";
const SCOPE = process.env.CANTON_SCOPE || "daml_ledger_api";

// Refresh 5 minutes before expiry to avoid edge cases
const TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000;
const TOKEN_EXPIRY_MS = 8 * 60 * 60 * 1000; // 8 hours

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface CachedToken {
  token: string;
  expiresAt: number;
}

let cachedToken: CachedToken | null = null;
let refreshPromise: Promise<string> | null = null;

/**
 * Exchange client credentials for an access token
 */
async function fetchAccessToken(): Promise<string> {
  if (!CLIENT_SECRET) {
    throw new Error(
      "CANTON_CLIENT_SECRET not set. Configure it in .env.local or Vercel environment variables."
    );
  }

  const params = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    audience: AUDIENCE,
    scope: SCOPE,
  });

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to fetch access token: ${response.status} ${response.statusText}\n${errorText}`
    );
  }

  const data: TokenResponse = await response.json();
  
  // Cache the token with expiry time
  const expiresAt = Date.now() + (data.expires_in * 1000) - TOKEN_REFRESH_BUFFER_MS;
  cachedToken = {
    token: data.access_token,
    expiresAt,
  };

  return data.access_token;
}

/**
 * Get a valid access token, refreshing if necessary
 * 
 * Implements singleton pattern to prevent concurrent refresh requests.
 */
export async function getAccessToken(): Promise<string> {
  // Return cached token if still valid
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  // Prevent concurrent refresh requests
  if (refreshPromise) {
    return refreshPromise;
  }

  try {
    refreshPromise = fetchAccessToken();
    const token = await refreshPromise;
    return token;
  } finally {
    refreshPromise = null;
  }
}

/**
 * Force a token refresh (useful for testing or manual refresh)
 */
export async function refreshToken(): Promise<string> {
  cachedToken = null;
  return getAccessToken();
}

/**
 * Check if a token is currently cached and valid
 */
export function hasValidToken(): boolean {
  return cachedToken !== null && Date.now() < cachedToken.expiresAt;
}

/**
 * Get token expiry time (for debugging/monitoring)
 */
export function getTokenExpiry(): number | null {
  return cachedToken?.expiresAt ?? null;
}
