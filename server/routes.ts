import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import Stripe from "stripe";
import { getPracticeTestById } from "@shared/practice-tests-data";

// Initialize Stripe - blueprint: javascript_stripe
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Warning: STRIPE_SECRET_KEY not set. Payment functionality will be disabled.');
}

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export async function registerRoutes(app: Express): Promise<Server> {
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
    if (!stripe) {
      return res.status(503).json({ 
        message: "Payment processing is currently unavailable. Please contact support." 
      });
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
      console.error("Stripe payment intent error:", error);
      res.status(500).json({ 
        message: "Error creating payment intent: " + error.message 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
