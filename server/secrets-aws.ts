// AWS Secrets Manager implementation
// This file will be used once @aws-sdk/client-secrets-manager is installed
// To use this implementation, rename this file to secrets.ts and remove the temporary implementation

import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

interface StripeSecrets {
  STRIPE_SECRET_KEY: string;
  STRIPE_PUBLIC_KEY: string;
}

// Cache for secrets to avoid repeated API calls
let secretsCache: StripeSecrets | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches Stripe secrets from AWS Secrets Manager based on NODE_ENV
 * @returns Promise<StripeSecrets> - Object containing Stripe secret and public keys
 */
export async function getStripeSecrets(): Promise<StripeSecrets> {
  // Check cache first
  const now = Date.now();
  if (secretsCache && (now - lastFetchTime) < CACHE_DURATION) {
    return secretsCache;
  }

  try {
    const client = new SecretsManagerClient({
      region: "ap-southeast-6", // Same region as used in admin app
    });

    // Determine secret name based on NODE_ENV
    const secretName = process.env.NODE_ENV === "production" 
      ? "stripe/prod" 
      : "stripe/dev";

    console.log(`Fetching Stripe secrets from: ${secretName}`);

    const command = new GetSecretValueCommand({
      SecretId: secretName,
    });

    const response = await client.send(command);
    
    if (!response.SecretString) {
      throw new Error(`No secret string found in ${secretName}`);
    }

    const secrets = JSON.parse(response.SecretString) as StripeSecrets;
    
    // Validate that required keys exist
    if (!secrets.STRIPE_SECRET_KEY || !secrets.STRIPE_PUBLIC_KEY) {
      throw new Error(`Missing required keys in ${secretName}. Expected: STRIPE_SECRET_KEY, STRIPE_PUBLIC_KEY`);
    }

    // Cache the secrets
    secretsCache = secrets;
    lastFetchTime = now;

    console.log(`Successfully fetched Stripe secrets from ${secretName}`);
    return secrets;

  } catch (error) {
    console.error("Error fetching Stripe secrets from AWS Secrets Manager:", error);
    
    // Fallback to environment variables if secrets manager fails
    const fallbackSecrets = {
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
      STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY || "",
    };

    if (!fallbackSecrets.STRIPE_SECRET_KEY || !fallbackSecrets.STRIPE_PUBLIC_KEY) {
      throw new Error(
        `Failed to fetch Stripe secrets from AWS Secrets Manager and no fallback environment variables found. ` +
        `Please ensure ${process.env.NODE_ENV === "production" ? "stripe/prod" : "stripe/dev"} secret exists in AWS Secrets Manager ` +
        `or set STRIPE_SECRET_KEY and STRIPE_PUBLIC_KEY environment variables.`
      );
    }

    console.warn("Using fallback environment variables for Stripe secrets");
    return fallbackSecrets;
  }
}

/**
 * Clears the secrets cache (useful for testing or when secrets are rotated)
 */
export function clearSecretsCache(): void {
  secretsCache = null;
  lastFetchTime = 0;
}






