import { loadStripe } from '@stripe/stripe-js';

// Cache for Stripe public key to avoid repeated API calls
let stripePublicKeyCache: string | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches the Stripe public key from the server
 * @returns Promise<string> - The Stripe public key
 */
async function fetchStripePublicKey(): Promise<string> {
  // Check cache first
  const now = Date.now();
  if (stripePublicKeyCache && (now - lastFetchTime) < CACHE_DURATION) {
    return stripePublicKeyCache;
  }

  // Get the public key from environment variable
  const publicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
  
  if (!publicKey) {
    throw new Error('VITE_STRIPE_PUBLIC_KEY environment variable is not set');
  }

  // Cache the public key
  stripePublicKeyCache = publicKey;
  lastFetchTime = now;

  return publicKey;
}

/**
 * Initializes Stripe with the public key from the server
 * @returns Promise<Stripe | null> - The initialized Stripe instance or null if failed
 */
export async function initializeStripe(): Promise<typeof import('@stripe/stripe-js').Stripe | null> {
  try {
    const publicKey = await fetchStripePublicKey();
    return await loadStripe(publicKey);
  } catch (error) {
    console.error('Failed to initialize Stripe:', error);
    return null;
  }
}

/**
 * Clears the Stripe public key cache (useful for testing or when keys are rotated)
 */
export function clearStripeCache(): void {
  stripePublicKeyCache = null;
  lastFetchTime = 0;
}
