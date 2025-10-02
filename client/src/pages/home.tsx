import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { useAuth0 } from "@auth0/auth0-react";
import {
  Star,
  Award,
  Users,
  CheckCircle,
  Clock,
  LifeBuoy,
  Medal,
  Server,
  TrendingUp,
  Shield,
  DollarSign,
  Building,
  GraduationCap,
  BookOpen,
  Trophy,
  Briefcase,
  Rocket,
  PlayCircle,
  Menu,
  ChevronDown,
  LucideMessageCircle,
  LogIn,
  LogOut,
} from "lucide-react";

const isAuth0Configured = () => {
  return !!(import.meta.env.VITE_AUTH0_DOMAIN && import.meta.env.VITE_AUTH0_CLIENT_ID);
};

function useAuth0Safe() {
  const configured = isAuth0Configured();
  
  if (!configured) {
    // In dev mode without Auth0, show logged-in state with mock user
    return {
      isAuthenticated: true,
      isLoading: false,
      user: {
        name: "Aseef Ahmed",
        email: "student@example.com",
      },
      loginWithRedirect: () => {
        alert("Auth0 login is not configured yet. Please add VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID to enable authentication.");
      },
      logout: () => {
        console.log("Logging out (dev mode)");
        window.location.href = "/";
      },
    };
  }
  
  return useAuth0();
}

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showStickyCta, setShowStickyCta] = useState(false);
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0Safe();

  useEffect(() => {
    // Fade in animation on scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    }, observerOptions);

    document.querySelectorAll(".fade-in").forEach((el) => {
      observer.observe(el);
    });

    // Sticky CTA button
    const handleScroll = () => {
      const hero = document.getElementById("hero");
      if (hero) {
        const heroBottom = hero.offsetTop + hero.offsetHeight;
        const scrollPosition = window.pageYOffset;
        setShowStickyCta(scrollPosition > heroBottom);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

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

  return (
    <div className="bg-background text-foreground font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-[#f2f4f7] text-black backdrop-blur-md border-b border-transparent z-40 shadow-lg shadow-gray-900/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src="/images/logo.png" width="70%" />
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-8">
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-black/90 hover:text-black-300 hover:font-bold transition-colors"
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection("curriculum")}
                  className="text-black/90 hover:text-black-300 hover:font-bold transition-colors"
                >
                  Curriculum
                </button>
                <button
                  onClick={() => scrollToSection("benefits")}
                  className="text-black/90 hover:text-black-300 hover:font-bold transition-colors"
                >
                  Benefits
                </button>
                <button
                  onClick={() => scrollToSection("testimonials")}
                  className="text-black/90 hover:text-black-300 hover:font-bold transition-colors"
                >
                  Reviews
                </button>
                <Link href="/practice-tests">
                  <button className="text-black/90 hover:text-black-300 hover:font-bold transition-colors" data-testid="nav-practice-tests">
                    Practice Tests
                  </button>
                </Link>
                <Button
                  onClick={() => scrollToSection("pricing")}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                >
                  <Rocket className="mr-2 h-4 w-4" />
                  Enroll Now
                </Button>
                {isAuthenticated ? (
                  <Button
                    onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    data-testid="button-logout"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </Button>
                ) : (
                  <Button
                    onClick={() => loginWithRedirect()}
                    variant="default"
                    className="bg-primary hover:bg-primary/90"
                    data-testid="button-login"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Log In
                  </Button>
                )}
              </div>
            </div>
            <div className="md:hidden flex items-center gap-2">
              {isAuthenticated ? (
                <Button
                  onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                  variant="outline"
                  size="sm"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  data-testid="button-logout-mobile"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => loginWithRedirect()}
                  variant="default"
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                  data-testid="button-login-mobile"
                >
                  <LogIn className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="h-5 w-5 text-black" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center pt-16 bg-[#104d84]"
      >
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="fade-in">
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-white mb-6 leading-tight">
              Master <span className="text-yellow-400">AWS</span> Solution
              Architect with an{" "}
              <span className="text-yellow-400">Industry Expert</span>
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8 max-w-4xl mx-auto leading-relaxed">
              Learn from <strong>Aseef Ahmed</strong>, a Senior DevOps Engineer
              with <strong>12 AWS & 5 Azure certifications</strong> and
              experience at Amazon, Deloitte, and NZ Ministries & Banks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                onClick={() => scrollToSection("pricing")}
                className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                data-testid="button-enroll-hero"
              >
                <Rocket className="mr-2 h-5 w-5" />
                Enroll Now
              </Button>
              <Button
                onClick={() => scrollToSection("curriculum")}
                className="bg-[#f2c617] text-black px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                data-testid="button-enroll-hero"
              >
                <Rocket className="mr-2 h-5 w-5" />
                View Curriculum
              </Button>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
              <div className="flex items-center">
                <Award className="h-5 w-5 text-yellow-500 mr-2" />
                <span className="text-white">17+ Certifications</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-yellow-500 mr-2" />
                <span className="text-white">500+ Students Trained</span>
              </div>
              <div className="flex items-center">
                <Star className="h-5 w-5 text-accent mr-2" />
                <span className="text-white">4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-orange-400" />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="fade-in">
              <div className="relative">
                <img
                  src="/images/aseefahmed.png"
                  alt="Aseef Ahmed - AWS Solution Architect Expert"
                  className="rounded-2xl shadow-2xl w-full max-w-md mx-auto"
                />
                <div className="absolute -bottom-6 -right-6 bg-accent text-accent-foreground p-4 rounded-2xl shadow-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold">17+</div>
                    <div className="text-sm">Certifications</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="fade-in">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-6">
                Meet Your <span className="text-primary">AWS Expert</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Aseef Ahmed is a highly accomplished Senior DevOps Engineer with
                extensive expertise in cloud architecture, AWS services, and
                enterprise-scale implementations. His journey spans across
                industry giants including Amazon, Deloitte, and MSD New Zealand.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <Card className="p-4">
                  <CardContent className="p-0">
                    <div className="text-2xl font-bold text-primary">12+</div>
                    <div className="text-sm text-muted-foreground">
                      AWS Certifications
                    </div>
                  </CardContent>
                </Card>
                <Card className="p-4">
                  <CardContent className="p-0">
                    <div className="text-2xl font-bold text-primary">5+</div>
                    <div className="text-sm text-muted-foreground">
                      Azure Certifications
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-3">
                <div className="flex items-center text-muted-foreground">
                  <CheckCircle className="h-5 w-5 text-primary mr-3" />
                  <span>Expert in AWS Solution Architecture & DevOps</span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <CheckCircle className="h-5 w-5 text-primary mr-3" />
                  <span>
                    Experience at Amazon, Deloitte, and NZ ministries & banks
                  </span>
                </div>
                <div className="flex items-center text-muted-foreground">
                  <CheckCircle className="h-5 w-5 text-primary mr-3" />
                  <span>
                    Proven track record in enterprise cloud migrations
                  </span>
                </div>
              </div>

              <div></div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn Section */}
      <section id="curriculum" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              What You'll <span className="text-primary">Master</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive curriculum designed to make you a confident AWS
              Solution Architect
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card
              className="fade-in hover:shadow-lg transition-all duration-300 hover:border-primary/50"
              data-testid="card-aws-core"
            >
              <CardContent className="p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Server className="text-primary h-6 w-6" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-3">
                  AWS Core Services
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    EC2 & Auto Scaling
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    S3 & Storage Solutions
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    VPC & Networking
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    RDS & Database Services
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card
              className="fade-in hover:shadow-lg transition-all duration-300 hover:border-primary/50"
              data-testid="card-high-availability"
            >
              <CardContent className="p-6">
                <div className="bg-accent/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="text-accent h-6 w-6" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-3">
                  High Availability & Scalability
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Load Balancing Strategies
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Multi-AZ Deployments
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Disaster Recovery
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Performance Optimization
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card
              className="fade-in hover:shadow-lg transition-all duration-300 hover:border-primary/50"
              data-testid="card-security"
            >
              <CardContent className="p-6">
                <div className="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="text-red-600 h-6 w-6" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-3">
                  Security & IAM
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    IAM Policies & Roles
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Security Groups & NACLs
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Encryption & KMS
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Compliance & Auditing
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card
              className="fade-in hover:shadow-lg transition-all duration-300 hover:border-primary/50"
              data-testid="card-cost-optimization"
            >
              <CardContent className="p-6">
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="text-green-600 h-6 w-6" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-3">
                  Cost Optimization
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Reserved Instances
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Spot Instances
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Cost Monitoring
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Budget Management
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card
              className="fade-in hover:shadow-lg transition-all duration-300 hover:border-primary/50"
              data-testid="card-well-architected"
            >
              <CardContent className="p-6">
                <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Building className="text-purple-600 h-6 w-6" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-3">
                  Well-Architected Framework
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    5 Pillars Deep Dive
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Architecture Review
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Best Practices
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Design Patterns
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card
              className="fade-in hover:shadow-lg transition-all duration-300 hover:border-primary/50"
              data-testid="card-exam-prep"
            >
              <CardContent className="p-6">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="text-blue-600 h-6 w-6" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-3">
                  Exam Prep & Real-World
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Practice Exams
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Real-World Scenarios
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Hands-on Labs
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                    Interview Preparation
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose This Training */}
      <section id="benefits" className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Why Choose <span className="text-primary">Our Training</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience the difference of learning from an industry expert with
              proven results
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="fade-in text-center" data-testid="benefit-expert">
              <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                <GraduationCap className="text-primary-foreground h-8 w-8" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3">
                Industry Expert
              </h3>
              <p className="text-muted-foreground">
                Learn from a seasoned professional with real-world experience at
                top tech companies
              </p>
            </div>

            <div
              className="fade-in text-center"
              data-testid="benefit-labs"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="bg-accent w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                <BookOpen className="text-accent-foreground h-8 w-8" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3">
                Hands-on Labs
              </h3>
              <p className="text-muted-foreground">
                Practice with real AWS environments and tackle practical
                scenarios you'll face in the job
              </p>
            </div>

            <div
              className="fade-in text-center"
              data-testid="benefit-certification"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                <Trophy className="text-white h-8 w-8" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3">
                Certification Prep
              </h3>
              <p className="text-muted-foreground">
                Comprehensive exam preparation with practice tests and proven
                strategies
              </p>
            </div>

            <div
              className="fade-in text-center"
              data-testid="benefit-career"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="bg-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                <Briefcase className="text-white h-8 w-8" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3">
                Career Guidance
              </h3>
              <p className="text-muted-foreground">
                Get guidance on real-world projects, job interviews, and career
                advancement
              </p>
            </div>
          </div>

          <Card className="mt-16 fade-in">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-primary mr-4 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-2">Flexible Schedule</h4>
                    <p className="text-muted-foreground text-sm">
                      Choose from 1-to-1 or group sessions that fit your
                      schedule
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <LifeBuoy className="h-6 w-6 text-primary mr-4 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-2">Ongoing Support</h4>
                    <p className="text-muted-foreground text-sm">
                      Get continued support even after course completion
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Medal className="h-6 w-6 text-primary mr-4 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-2">
                      Completion Certificate
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      Receive a certificate of completion to showcase your
                      skills
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              What Our <span className="text-primary">Students Say</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Join hundreds of professionals who've advanced their careers with
              our training
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card
              className="fade-in hover:shadow-lg transition-all duration-300"
              data-testid="testimonial-michael"
            >
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Aseef's training was exceptional! His real-world experience
                  really showed through. I passed my AWS Solutions Architect
                  exam on the first try thanks to his comprehensive approach."
                </p>
                <div className="flex items-center">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
                    alt="Michael Chen testimonial"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold">Michael Chen</div>
                    <div className="text-sm text-muted-foreground">
                      Cloud Engineer at Microsoft
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className="fade-in hover:shadow-lg transition-all duration-300"
              data-testid="testimonial-sarah"
            >
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "The hands-on labs were incredible. Aseef didn't just teach
                  theory - he showed us how to apply AWS services in real
                  scenarios. It boosted my confidence tremendously."
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full mr-4 bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white font-semibold">SJ</span>
                  </div>
                  <div>
                    <div className="font-semibold">Sarah Johnson</div>
                    <div className="text-sm text-muted-foreground">
                      DevOps Engineer at Shopify
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className="fade-in hover:shadow-lg transition-all duration-300"
              data-testid="testimonial-david"
            >
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "Best investment in my career! Aseef's industry insights and
                  practical approach helped me land a senior cloud architect
                  role. His teaching style is engaging and effective."
                </p>
                <div className="flex items-center">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100"
                    alt="David Rodriguez testimonial"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold">David Rodriguez</div>
                    <div className="text-sm text-muted-foreground">
                      Senior Cloud Architect at AWS
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 fade-in">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
              Start Your Cloud Career{" "}
              <span className="text-primary">Today</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the training option that works best for you
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* 1-to-1 Training */}
            <Card
              className="fade-in hover:shadow-xl transition-all duration-300 hover:border-primary relative"
              data-testid="pricing-one-on-one"
            >
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-heading font-semibold mb-2">
                  1-to-1 Training
                </h3>
                <div className="text-3xl font-bold text-primary mb-4">$300</div>
                <p className="text-muted-foreground mb-6">
                  Personalized learning experience
                </p>
                <ul className="space-y-3 text-sm text-muted-foreground mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Customized curriculum
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Flexible scheduling
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Direct mentor access
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Career guidance
                  </li>
                </ul>
                <Button
                  onClick={() =>
                    (window.location.href =
                      "https://buy.stripe.com/5kQ4gz098evx9OHd0F2Ry0d")
                  } // 👈 Replace with your Stripe link
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 transform hover:scale-105"
                  data-testid="button-book-one-on-one"
                >
                  Book Your Spot
                </Button>
              </CardContent>
            </Card>

            {/* 2 Person Group */}
            <Card
              className="fade-in hover:shadow-xl transition-all duration-300 hover:border-primary relative"
              data-testid="pricing-two-person"
            >
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">
                  15% OFF
                </span>
              </div>
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-heading font-semibold mb-2">
                  2 Person Group
                </h3>
                <div className="text-3xl font-bold text-primary mb-4">$255</div>
                <p className="text-muted-foreground mb-6">
                  Perfect for learning partners
                </p>
                <ul className="space-y-3 text-sm text-muted-foreground mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Collaborative learning
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Shared discussions
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Cost effective
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Peer motivation
                  </li>
                </ul>
                <Button
                  onClick={() =>
                    (window.location.href =
                      "https://buy.stripe.com/cNi8wP1dcfzBgd55yd2Ry0e")
                  }
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 transform hover:scale-105"
                  data-testid="button-book-two-person"
                >
                  Book Your Spot
                </Button>
              </CardContent>
            </Card>

            {/* 3 Person Group */}
            <Card
              className="fade-in hover:shadow-xl transition-all duration-300 hover:border-primary relative"
              data-testid="pricing-three-person"
            >
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">
                  30% OFF
                </span>
              </div>
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-heading font-semibold mb-2">
                  3 Person Group
                </h3>
                <div className="text-3xl font-bold text-primary mb-4">$210</div>
                <p className="text-muted-foreground mb-6">
                  Great value for small teams
                </p>
                <ul className="space-y-3 text-sm text-muted-foreground mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Team building
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Group projects
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Significant savings
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-primary mr-2" />
                    Diverse perspectives
                  </li>
                </ul>
                <Button
                  onClick={() =>
                    (window.location.href =
                      "https://buy.stripe.com/7sY00j9JI3QTgd5e4J2Ry0f")
                  }
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 transform hover:scale-105"
                  data-testid="button-book-three-person"
                >
                  Book Your Spot
                </Button>
              </CardContent>
            </Card>

            {/* 4+ Person Group */}
            <Card
              className="fade-in border-2 border-accent hover:shadow-xl transition-all duration-300 relative"
              data-testid="pricing-four-plus"
            >
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">
                  BEST VALUE
                </span>
              </div>
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-heading font-semibold mb-2">
                  4 Person Group
                </h3>
                <div className="text-3xl font-bold text-accent mb-4">$180</div>
                <p className="text-muted-foreground mb-6">
                  Maximum savings & collaboration
                </p>
                <ul className="space-y-3 text-sm text-muted-foreground mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-accent mr-2" />
                    Corporate training
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-accent mr-2" />
                    Team workshops
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-accent mr-2" />
                    Maximum discount
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-accent mr-2" />
                    Rich discussions
                  </li>
                </ul>
                <Button
                  onClick={() =>
                    (window.location.href =
                      "https://buy.stripe.com/bJe00j8FE4UXf91e4J2Ry0g")
                  }
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground transition-all duration-300 transform hover:scale-105"
                  data-testid="button-book-four-plus"
                >
                  Book Your Spot
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12 fade-in">
            <p className="text-muted-foreground mb-6">
              All packages include comprehensive materials, hands-on labs, and
              post-training support
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-primary mr-2" />
                <span>Money-back guarantee</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-primary mr-2" />
                <span>Flexible scheduling</span>
              </div>
              <div className="flex items-center">
                <Award className="h-4 w-4 text-primary mr-2" />
                <span>Completion certificate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-heading font-bold mb-4">
                AWS Expert Training
              </h3>
              <p className="text-background/80 mb-4">
                Master AWS Solution Architecture with industry expert Aseef
                Ahmed. Transform your career with comprehensive, hands-on
                training.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://linkedin.com/in/aseefahmed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-background/80 hover:text-background transition-colors"
                  data-testid="link-linkedin"
                >
                  <i className="fab fa-linkedin text-xl"></i>
                </a>
                <a
                  href="https://youtube.com/@cloudindepth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-background/80 hover:text-background transition-colors"
                  data-testid="link-youtube"
                >
                  <i className="fab fa-youtube text-xl"></i>
                </a>
                <a
                  href="https://www.facebook.com/cloudacademy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-background/80 hover:text-background transition-colors"
                  data-testid="link-github"
                >
                  <i className="fab fa-facebook text-xl"></i>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => scrollToSection("curriculum")}
                    className="text-background/80 hover:text-background transition-colors"
                    data-testid="footer-curriculum"
                  >
                    Curriculum
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("benefits")}
                    className="text-background/80 hover:text-background transition-colors"
                    data-testid="footer-benefits"
                  >
                    Benefits
                  </button>
                </li>

                <li>
                  <button
                    onClick={() => scrollToSection("pricing")}
                    className="text-background/80 hover:text-background transition-colors"
                    data-testid="footer-pricing"
                  >
                    Pricing
                  </button>
                </li>
                <li>
                  <a
                    href="https://skillsprofile.skillbuilder.aws/user/aseefahmed"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button
                      className="text-background/80 hover:text-background transition-colors"
                      data-testid="verify-creds"
                    >
                      Verify Credentials
                    </button>
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
              <div className="space-y-3 text-background/80">
                <div className="flex items-center">
                  <i className="fas fa-envelope mr-3"></i>
                  <span>aseefahmed@gmail.com</span>
                </div>
                <div className="flex items-center">
                  <i className="fab fa-linkedin mr-3"></i>
                  <span>linkedin.com/in/aseefahmed</span>
                </div>
                <div className="flex items-center">
                  <i className="fab fa-whatsapp mr-3"></i>
                  <span>+64 22 194 5611</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-globe mr-3"></i>
                  <span>Available for Global Training</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Sticky CTA Button */}
      {showStickyCta && (
        <div className="sticky-cta show">
          <a
            href="https://www.linkedin.com/in/aseefahmed/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-3 rounded-full shadow-2xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center"
              data-testid="button-sticky-cta"
            >
              <LucideMessageCircle className="mr-2 h-4 w-4" />
              Chat with Me
            </Button>
          </a>
        </div>
      )}
    </div>
  );
}
