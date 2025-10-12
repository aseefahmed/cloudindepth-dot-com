import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Clock,
  Facebook,
  Linkedin,
  Youtube,
  Send,
  CheckCircle,
  AlertCircle,
  Headphones,
  BookOpen,
  Zap,
  Users,
  Star,
  Globe,
  MessageSquare,
  Mail as MailIcon,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Support() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    priority: "medium"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24 hours.",
        variant: "default",
      });
      setFormData({ name: "", email: "", subject: "", message: "", priority: "medium" });
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get detailed help via email",
      contact: "aseefahmed@gmail.com",
      responseTime: "Within 24 hours",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      borderColor: "border-blue-200 dark:border-blue-800"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our team",
      contact: "+64 22 194 5611",
      responseTime: "Mon-Fri, 9AM-6PM NZT",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
      borderColor: "border-green-200 dark:border-green-800"
    },
    {
      icon: Facebook,
      title: "Facebook Community",
      description: "Join our active community",
      contact: "Cloud Academy",
      responseTime: "Usually within hours",
      color: "text-blue-700",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      borderColor: "border-blue-200 dark:border-blue-800",
      link: "https://www.facebook.com/cloudindepth/"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Instant support when available",
      contact: "Chat with us now",
      responseTime: "Real-time",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
      borderColor: "border-purple-200 dark:border-purple-800"
    }
  ];

  const faqItems = [
    {
      question: "How do I access my purchased practice tests?",
      answer: "Go to 'My Practice Tests' in your dashboard to see all your purchased tests and start taking them."
    },
    {
      question: "Can I retake practice tests?",
      answer: "Yes! You can retake any practice test as many times as you want. Your progress is saved each time."
    },
    {
      question: "How long do I have access to my tests?",
      answer: "You have lifetime access to all your purchased practice tests. No expiration dates!"
    },
    {
      question: "What if I'm having technical issues?",
      answer: "Contact us immediately via email or phone. We'll help resolve any technical problems quickly."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 30-day money-back guarantee if you're not satisfied with your purchase."
    },
    {
      question: "How can I track my progress?",
      answer: "Your dashboard shows detailed analytics of your test performance and progress over time."
    }
  ];

  const supportStats = [
    { icon: Users, label: "Students Helped", value: "10,000+" },
    { icon: Clock, label: "Avg Response Time", value: "2 Hours" },
    { icon: Star, label: "Satisfaction Rate", value: "98%" },
    { icon: Globe, label: "Global Support", value: "24/7" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mb-6 shadow-lg">
            <Headphones className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            We're Here to Help!
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Get the support you need to succeed in your AWS journey. Our expert team is ready to assist you with any questions or issues.
          </p>
        </div>

        {/* Support Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {supportStats.map((stat, index) => (
            <Card key={index} className="text-center border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-3">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{stat.value}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Methods */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  <MessageCircle className="h-6 w-6 text-blue-600" />
                  Get in Touch
                </CardTitle>
                <p className="text-slate-600 dark:text-slate-400">
                  Choose the best way to reach us based on your needs
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {contactMethods.map((method, index) => (
                    <Card key={index} className={`${method.bgColor} ${method.borderColor} border-2 hover:shadow-lg transition-all duration-200`}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg ${method.bgColor} ${method.borderColor} border`}>
                            <method.icon className={`h-6 w-6 ${method.color}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                              {method.title}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                              {method.description}
                            </p>
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-slate-900 dark:text-white">
                                {method.contact}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-500">
                                {method.responseTime}
                              </p>
                            </div>
                            {method.link && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-3 w-full"
                                onClick={() => window.open(method.link, '_blank')}
                              >
                                <Facebook className="h-4 w-4 mr-2" />
                                Facebook
                                <ExternalLink className="h-3 w-3 ml-2" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Help */}
           

            {/* FAQ */}
            <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-green-600" />
                  Frequently Asked
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {faqItems.slice(0, 4).map((faq, index) => (
                    <div key={index} className="border-b border-slate-200 dark:border-slate-700 pb-3 last:border-b-0">
                      <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                        {faq.question}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                We are there to help you succeed. Don't hesitate to reach out!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50"
                  onClick={() => window.open("https://www.linkedin.com/in/aseefahmed/", '_blank')}
                >
                  <MailIcon className="h-5 w-5 mr-2" />
                  Linkedin
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  onClick={() => window.open("https://www.facebook.com/cloudindepth/", '_blank')}
                >
                  <Facebook className="h-5 w-5 mr-2" />
                  Visit Facebook
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

