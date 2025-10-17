import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LucideMessageCircle } from "lucide-react";

interface ChatWithMeProps {
  showOnScroll?: boolean;
  scrollThreshold?: number;
  position?: "bottom-right" | "bottom-left" | "fixed";
  className?: string;
}

export default function ChatWithMe({ 
  showOnScroll = true, 
  scrollThreshold = 500,
  position = "bottom-right",
  className = ""
}: ChatWithMeProps) {
  const [isVisible, setIsVisible] = useState(!showOnScroll);

  useEffect(() => {
    if (!showOnScroll) {
      setIsVisible(true);
      return;
    }

    const handleScroll = () => {
      const scrollPosition = window.pageYOffset;
      setIsVisible(scrollPosition > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showOnScroll, scrollThreshold]);

  const getPositionClasses = () => {
    switch (position) {
      case "bottom-left":
        return "bottom-6 left-6";
      case "fixed":
        return "fixed bottom-6 right-6";
      case "bottom-right":
      default:
        return "bottom-6 right-6";
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed ${getPositionClasses()} z-50 ${className}`}>
      <a
        href="https://www.linkedin.com/in/aseefahmed/"
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <Button
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-full shadow-lg font-medium transition-all duration-200 flex items-center border border-blue-500/20"
          data-testid="button-chat-with-me"
        >
          <LucideMessageCircle className="mr-2 h-4 w-4" />
          Chat with Me
        </Button>
      </a>
    </div>
  );
}
