import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { BookOpen, ArrowLeft } from "lucide-react";

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const offsetTop = element.offsetTop - 80;
    window.scrollTo({
      top: offsetTop,
      behavior: "smooth",
    });
  }
};

export default function QuestionsBankIndex() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation scrollToSection={scrollToSection} />
      
      <div className="pt-20 flex items-center justify-center min-h-screen">
        <div className="text-center max-w-2xl mx-auto p-8">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Questions Bank</h1>
          <p className="text-muted-foreground mb-6">
            Select a practice test to view its study notes and exam tips.
          </p>
          
          <div className="space-y-4">
            <Link href="/dashboard/questions-bank/saa">
              <Button className="w-full">
                <BookOpen className="h-4 w-4 mr-2" />
                AWS Solutions Architect Associate (SAA-C03)
              </Button>
            </Link>
          </div>
          
          <div className="mt-8">
            <Link href="/practice-tests">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Practice Tests
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}



