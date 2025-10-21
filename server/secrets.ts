import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface StripeSecrets {
  STRIPE_SECRET_KEY: string;
  STRIPE_PUBLIC_KEY: string;
}

// Cache for secrets to avoid repeated API calls
let secretsCache: StripeSecrets | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches Stripe secrets from AWS Secrets Manager using AWS CLI
 * @returns Promise<StripeSecrets> - Object containing Stripe secret and public keys
 */
export async function getStripeSecrets(): Promise<StripeSecrets> {
  // Check cache first
  const now = Date.now();
  if (secretsCache && (now - lastFetchTime) < CACHE_DURATION) {
    return secretsCache;
  }

  try {
    // Determine secret name based on NODE_ENV
    const secretName = process.env.NODE_ENV === "production" 
      ? "stripe/prod" 
      : "stripe/dev";

    console.log(`Fetching Stripe secrets from AWS Secrets Manager: ${secretName}`);

    // Use AWS CLI to fetch the secret
    // Try ap-southeast-6 first, then fallback to ap-southeast-2
    let region = "ap-southeast-6";
    let { stdout, stderr } = await execAsync(
      `aws secretsmanager get-secret-value --secret-id "${secretName}" --region ${region} --query SecretString --output text`
    );

    // If the first region fails, try the default region
    if (stderr && stderr.includes('UnrecognizedClientException')) {
      console.log(`Trying fallback region ap-southeast-2 for secret: ${secretName}`);
      region = "ap-southeast-2";
      const result = await execAsync(
        `aws secretsmanager get-secret-value --secret-id "${secretName}" --region ${region} --query SecretString --output text`
      );
      stdout = result.stdout;
      stderr = result.stderr;
    }

    if (stderr) {
      throw new Error(`AWS CLI error: ${stderr}`);
    }

    if (!stdout || stdout.trim() === 'None') {
      throw new Error(`No secret found with name: ${secretName}`);
    }

    // Parse the JSON secret
    const secretString = stdout.trim();
    const secrets = JSON.parse(secretString) as StripeSecrets;
    
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
    
    // Fallback to environment variables if AWS CLI fails
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
