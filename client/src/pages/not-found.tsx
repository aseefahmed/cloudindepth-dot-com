import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <Card className="w-full max-w-lg mx-4 shadow-2xl">
        <CardContent className="pt-8 pb-8 px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <AlertCircle className="h-16 w-16 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              The page you're looking for doesn't exist. This could be a practice test that's no longer available, 
              or the URL might be incorrect.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <Button className="flex items-center gap-2 px-6 py-3">
                  <Home className="h-4 w-4" />
                  Go Home
                </Button>
              </Link>
              <Link href="/practice-tests">
                <Button variant="outline" className="flex items-center gap-2 px-6 py-3">
                  <ArrowLeft className="h-4 w-4" />
                  Browse Practice Tests
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
