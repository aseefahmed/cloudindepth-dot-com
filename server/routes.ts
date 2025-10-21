import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import Stripe from "stripe";
import { getPracticeTestById } from "@shared/practice-tests-data";
import { getStripeSecrets } from "./secrets";

// Initialize Stripe with secrets from AWS Secrets Manager
let stripe: Stripe | null = null;

// Initialize Stripe asynchronously
async function initializeStripe() {
  try {
    const secrets = await getStripeSecrets();
    
    if (!secrets.STRIPE_SECRET_KEY) {
      console.warn('Warning: STRIPE_SECRET_KEY not found in secrets. Payment functionality will be disabled.');
      return null;
    }

    stripe = new Stripe(secrets.STRIPE_SECRET_KEY, {
      // Increase network timeout and allow automatic retries for transient issues
      timeout: 60000,
      maxNetworkRetries: 2,
    });

    console.log('Stripe initialized successfully with secrets from AWS Secrets Manager');
    return stripe;
  } catch (error) {
    console.error('Failed to initialize Stripe:', error);
    return null;
  }
}

// Initialize Stripe on module load
initializeStripe();

export async function registerRoutes(app: Express): Promise<Server> {
  // Get Stripe public key for client-side configuration
  app.get("/api/stripe-public-key", async (req, res) => {
    try {
      const secrets = await getStripeSecrets();
      
      if (!secrets.STRIPE_PUBLIC_KEY) {
        return res.status(503).json({ 
          message: "Stripe public key not available" 
        });
      }

      res.json({ 
        publicKey: secrets.STRIPE_PUBLIC_KEY 
      });
    } catch (error) {
      console.error("Error fetching Stripe public key:", error);
      res.status(500).json({ 
        message: "Error fetching Stripe public key" 
      });
    }
  });

  // Get practice test details by ID - secure endpoint for checkout
  app.get("/api/practice-test/:testId", async (req, res) => {
    try {
      const { testId } = req.params;
      const test = getPracticeTestById(testId);
      
      if (!test) {
        return res.status(404).json({ message: "Practice test not found" });
      }
      
      res.json(test);
    } catch (error: any) {
      console.error("Error fetching practice test:", error);
      res.status(500).json({ message: "Error fetching practice test details" });
    }
  });

  // Stripe payment route for one-time payments - blueprint: javascript_stripe
  // Security: Price is retrieved server-side to prevent tampering
  app.post("/api/create-payment-intent", async (req, res) => {
    // Ensure Stripe is initialized
    if (!stripe) {
      try {
        await initializeStripe();
        if (!stripe) {
          return res.status(503).json({ 
            message: "Payment processing is currently unavailable. Please contact support." 
          });
        }
      } catch (error) {
        console.error("Failed to initialize Stripe for payment intent:", error);
        return res.status(503).json({ 
          message: "Payment processing is currently unavailable. Please contact support." 
        });
      }
    }

    try {
      const { testId } = req.body;
      
      if (!testId) {
        return res.status(400).json({ message: "Test ID is required" });
      }

      // Get test details from server-side data source (security: prevents price tampering)
      const test = getPracticeTestById(testId);
      
      if (!test) {
        return res.status(404).json({ message: "Practice test not found" });
      }

      // Use server-side price (security critical)
      const amountInCents = Math.round(test.price * 100);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: "usd",
        metadata: {
          testId: test.id,
          testTitle: test.title,
          testSubtitle: test.subtitle,
        },
      });
      
      res.json({ 
        clientSecret: paymentIntent.client_secret,
        test: {
          id: test.id,
          title: test.title,
          subtitle: test.subtitle,
          price: test.price,
          features: test.features
        }
      });
    } catch (error: any) {
      // Log structured details to aid debugging of network-level issues
      console.error("Stripe payment intent error:", {
        message: error?.message,
        type: error?.type,
        code: error?.code,
        statusCode: error?.statusCode,
        requestId: error?.requestId,
      });
      res.status(500).json({ 
        message: "Error creating payment intent: " + (error?.message || "Unknown error"),
        code: error?.code,
        type: error?.type,
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
