// Blueprint: javascript_stripe - Checkout page for one-time payments
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CreditCard, 
  Lock, 
  CheckCircle, 
  ArrowLeft,
  Shield,
  Award
} from "lucide-react";
import { Link } from "wouter";
import { useAuth0Safe } from "@/components/auth-components";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  console.error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : null;

interface CheckoutFormProps {
  testTitle: string;
  price: number;
  practiceTestId: string;
  questions: number;
  flashcards: number;
}

const CheckoutForm = ({ testTitle, price, practiceTestId, questions, flashcards }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth0Safe();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (error) {
      setIsProcessing(false);
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Fire-and-forget recording of the purchase; do not block success UX
      console.log("__________________________")
      console.log(testTitle, price, practiceTestId, questions, flashcards)
      const userId = (user && (user.sub || user.user_id)) || undefined;
      try {
        if (userId) {
          fetch('https://9s5z6fbk84.execute-api.ap-southeast-6.amazonaws.com/prod/record_purchase', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              user_id: userId,
              practice_test_id: practiceTestId,
              test_title: testTitle,
              price: price,
              questions: questions,
              flashcards: flashcards
            }),
            keepalive: true,
          }).catch(() => {});
        }
      } catch {}
      toast({
        title: "Payment Successful",
        description: "Thank you for your purchase! Redirecting to student portal...",
      });
      setTimeout(() => {
        setLocation("/dashboard");
      }, 1500);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Lock className="h-4 w-4" />
          <span>Secure payment powered by Stripe</span>
        </div>
        <PaymentElement />
      </div>

      <Button 
        type="submit"
        className="w-full h-12 text-lg gap-2 bg-gradient-to-r from-primary to-accent"
        disabled={!stripe || isProcessing}
        data-testid="button-complete-payment"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5" />
            Pay ${price}
          </>
        )}
      </Button>

      <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Shield className="h-3 w-3" />
          <span>SSL Secured</span>
        </div>
        <div className="flex items-center gap-1">
          <Lock className="h-3 w-3" />
          <span>256-bit Encryption</span>
        </div>
      </div>
    </form>
  );
};

export default function Checkout() {
  const [, params] = useRoute("/checkout/:testId");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState("");
  const [testDetails, setTestDetails] = useState<{
    title: string;
    subtitle: string;
    price: number;
    features: string[];
    questions: number;
    flashcards: number;
  } | null>(null);

  const testId = params?.testId || "";

  const createPaymentIntent = async (testId: string, amount: number) => {
    try {
      console.log('Creating payment intent for:', { testId, amount });
      
      // Create payment intent using your existing API endpoint
      const response = await fetch('https://9s5z6fbk84.execute-api.ap-southeast-6.amazonaws.com/prod/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testId: testId,
          amount: amount * 100, // Convert to cents for Stripe
          currency: 'usd'
        })
      });
      
      console.log('Payment intent response status:', response.status);
      console.log('Payment intent response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Payment intent API error response:', errorText);
        
        // If the Lambda function isn't deployed yet, show a helpful message
        if (response.status === 404 || response.status === 500) {
          toast({
            title: "Payment Service Unavailable",
            description: "The payment service is currently being set up. Please try again later or contact support.",
            variant: "destructive",
          });
          return;
        }
        
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Payment intent response data:', data);
      
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        console.log('Payment intent created successfully');
      } else {
        console.error('Missing clientSecret in response:', data);
        throw new Error(data.error || data.message || 'Failed to create payment intent - no client secret received');
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
      
      // Check if it's a network error (Lambda not deployed)
      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast({
          title: "Payment Service Unavailable",
          description: "Unable to connect to payment service. Please check your connection and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Payment Setup Failed",
          description: error instanceof Error ? error.message : "Unable to initialize payment. Please try again.",
          variant: "destructive",
        });
      }
      setClientSecret("");
    }
  };

  useEffect(() => {
    if (!testId) {
      toast({
        title: "Invalid Checkout",
        description: "Missing test ID. Please try again.",
        variant: "destructive",
      });
      setLocation("/practice-tests");
      return;
    }

    // Fetch course details from API
    fetch('https://9s5z6fbk84.execute-api.ap-southeast-6.amazonaws.com/prod/get_course_details', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: testId })
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Course details API response:', data);
        
        // Handle different possible response formats
        let courseData;
        if (data.course) {
          courseData = data.course;
        } else if (data.data) {
          courseData = data.data;
        } else if (data.message) {
          throw new Error(`API Error: ${data.message}`);
        } else {
          courseData = data;
        }
        console.log("__________________________")
        console.log(courseData)
        if (courseData) {
          setTestDetails({
            title: courseData.title || courseData.name || courseData.course_title || "Practice Test",
            subtitle: courseData.subtitle || courseData.short_description || courseData.course_subtitle || "Comprehensive practice test",
            price: courseData.price || courseData.cost || courseData.course_price || 0,
            questions: courseData.questions || 0,
            flashcards: courseData.flashcards || 0,
            features: courseData.features || courseData.included_features || courseData.benefits || [
              "Practice tests included",
              "Detailed explanations",
              "Performance tracking",
              "Lifetime access"
            ]
          });
          
          // Create payment intent with the course details
          createPaymentIntent(testId, courseData.price);
        } else {
          throw new Error("No course data received from API");
        }
      })
      .catch((error) => {
        console.error('Error fetching course details:', error);
        toast({
          title: "Course Details Failed",
          description: error.message || "Unable to load course details. Please try again.",
          variant: "destructive",
        });
        setTimeout(() => setLocation("/practice-tests"), 2000);
      });
  }, [testId, toast, setLocation]);

  if (!stripePromise) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="p-12 text-center">
            <CreditCard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Payment Unavailable</h2>
            <p className="text-muted-foreground mb-6">
              Payment processing is currently unavailable. Please contact support.
            </p>
            <Link href="/practice-tests">
              <Button data-testid="button-back-to-tests">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Practice Tests
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!testDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (testDetails && !clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Setting up payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/practice-tests">
            <Button variant="ghost" className="gap-2 mb-4" data-testidfl="button-back">
              <ArrowLeft className="h-4 w-4" />
              Back to Practice Tests
            </Button>
          </Link>
          <h1 className="text-3xl font-heading font-bold">Complete Your Purchase</h1>
          <p className="text-muted-foreground mt-2">Secure checkout with Stripe</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{testDetails.title}</h3>
                  <p className="text-sm text-muted-foreground">{testDetails.subtitle}</p>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-semibold mb-2">What's included:</h4>
                  <ul className="space-y-2">
                    {testDetails.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${testDetails.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">${testDetails.price}</span>
                  </div>
                </div>

                <div className="bg-accent/10 rounded-lg p-4 border border-accent/20">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Lifetime Access Guaranteed
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-3">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm 
                    testTitle={testDetails.title} 
                    price={testDetails.price} 
                    practiceTestId={testId}
                    questions={testDetails.questions}
                    flashcards={testDetails.flashcards}
                  />
                </Elements>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div className="bg-background rounded-lg p-4 border">
                <Shield className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-xs font-medium">Secure Payment</p>
              </div>
              <div className="bg-background rounded-lg p-4 border">
                <Lock className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-xs font-medium">Data Protected</p>
              </div>
              <div className="bg-background rounded-lg p-4 border">
                <CheckCircle className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-xs font-medium">Money Back</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
