import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import {
  ArrowLeft,
  Building,
  Clock,
  Users,
  BookOpen,
  Award,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Target,
  Shield,
  Cloud,
  Code,
  Database,
  Server,
  GitBranch,
  Container,
  Monitor,
  Settings,
  TrendingUp,
  Calendar,
  Download,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Zap,
  Lock,
  Network,
  Layers,
  Cpu,
  Globe,
  Terminal,
  GitCommit,
  Workflow,
  Activity,
  Scale,
  DollarSign,
  BarChart3,
  PieChart
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PathStage {
  id: string;
  title: string;
  description: string;
  duration: string;
  order: number;
  isCompleted: boolean;
  isCurrent: boolean;
  skills: string[];
  resources: Resource[];
  milestones: Milestone[];
  icon: any;
  color: string;
}

interface Resource {
  id: string;
  title: string;
  type: "course" | "book" | "video" | "practice" | "certification";
  url: string;
  duration?: string;
  isFree: boolean;
  rating: number;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
}

const cloudArchitectStages: PathStage[] = [
  {
    id: "foundation",
    title: "Cloud Fundamentals & Architecture Principles",
    description: "Master cloud computing concepts and architectural design principles",
    duration: "6-8 weeks",
    order: 1,
    isCompleted: false,
    isCurrent: true,
    icon: Cloud,
    color: "from-green-500 to-green-600",
    skills: ["Cloud Computing", "Architecture Patterns", "Design Principles", "AWS Fundamentals"],
    resources: [
      {
        id: "f1",
        title: "Cloud Computing Fundamentals",
        type: "course",
        url: "#",
        duration: "20 hours",
        isFree: false,
        rating: 4.8
      },
      {
        id: "f2",
        title: "AWS Solutions Architect Associate",
        type: "certification",
        url: "#",
        duration: "40 hours",
        isFree: false,
        rating: 4.9
      },
      {
        id: "f3",
        title: "Architecture Design Patterns",
        type: "book",
        url: "#",
        duration: "15 hours",
        isFree: true,
        rating: 4.7
      }
    ],
    milestones: [
      {
        id: "f1",
        title: "Understand Cloud Service Models",
        description: "Master IaaS, PaaS, SaaS, and serverless architectures",
        isCompleted: false
      },
      {
        id: "f2",
        title: "Design Scalable Architecture",
        description: "Create fault-tolerant and highly available systems",
        isCompleted: false
      },
      {
        id: "f3",
        title: "Pass AWS Solutions Architect Associate",
        description: "Achieve foundational cloud architecture certification",
        isCompleted: false
      }
    ]
  },
  {
    id: "scalability",
    title: "Scalability & Performance Optimization",
    description: "Design systems that can handle massive scale and optimize performance",
    duration: "6-8 weeks",
    order: 2,
    isCompleted: false,
    isCurrent: false,
    icon: Scale,
    color: "from-blue-500 to-blue-600",
    skills: ["Auto Scaling", "Load Balancing", "Caching", "Performance Tuning"],
    resources: [
      {
        id: "s1",
        title: "High-Performance Cloud Architecture",
        type: "course",
        url: "#",
        duration: "25 hours",
        isFree: false,
        rating: 4.8
      },
      {
        id: "s2",
        title: "AWS Auto Scaling & Load Balancing",
        type: "course",
        url: "#",
        duration: "18 hours",
        isFree: false,
        rating: 4.7
      },
      {
        id: "s3",
        title: "Redis & ElastiCache Optimization",
        type: "course",
        url: "#",
        duration: "15 hours",
        isFree: false,
        rating: 4.6
      }
    ],
    milestones: [
      {
        id: "s1",
        title: "Implement Auto Scaling Groups",
        description: "Design self-healing and auto-scaling infrastructure",
        isCompleted: false
      },
      {
        id: "s2",
        title: "Optimize Database Performance",
        description: "Implement caching and database optimization strategies",
        isCompleted: false
      },
      {
        id: "s3",
        title: "Design CDN Architecture",
        description: "Implement global content delivery networks",
        isCompleted: false
      }
    ]
  },
  {
    id: "security",
    title: "Security & Compliance Architecture",
    description: "Design secure cloud architectures and implement compliance frameworks",
    duration: "6-8 weeks",
    order: 3,
    isCompleted: false,
    isCurrent: false,
    icon: Shield,
    color: "from-red-500 to-red-600",
    skills: ["Security Architecture", "Compliance", "Identity Management", "Data Protection"],
    resources: [
      {
        id: "sec1",
        title: "Cloud Security Architecture",
        type: "course",
        url: "#",
        duration: "30 hours",
        isFree: false,
        rating: 4.9
      },
      {
        id: "sec2",
        title: "AWS Security Specialty",
        type: "certification",
        url: "#",
        duration: "35 hours",
        isFree: false,
        rating: 4.8
      },
      {
        id: "sec3",
        title: "GDPR & Compliance Frameworks",
        type: "course",
        url: "#",
        duration: "20 hours",
        isFree: false,
        rating: 4.7
      }
    ],
    milestones: [
      {
        id: "sec1",
        title: "Implement Zero-Trust Architecture",
        description: "Design secure network and access control systems",
        isCompleted: false
      },
      {
        id: "sec2",
        title: "Set up Identity & Access Management",
        description: "Configure comprehensive IAM policies and roles",
        isCompleted: false
      },
      {
        id: "sec3",
        title: "Achieve Security Compliance",
        description: "Implement SOC2, GDPR, and other compliance requirements",
        isCompleted: false
      }
    ]
  },
  {
    id: "cost-optimization",
    title: "Cost Optimization & Resource Management",
    description: "Design cost-effective architectures and optimize cloud spending",
    duration: "4-6 weeks",
    order: 4,
    isCompleted: false,
    isCurrent: false,
    icon: DollarSign,
    color: "from-yellow-500 to-yellow-600",
    skills: ["Cost Analysis", "Resource Optimization", "Reserved Instances", "FinOps"],
    resources: [
      {
        id: "c1",
        title: "Cloud Cost Optimization Strategies",
        type: "course",
        url: "#",
        duration: "20 hours",
        isFree: false,
        rating: 4.7
      },
      {
        id: "c2",
        title: "AWS Cost Management Tools",
        type: "course",
        url: "#",
        duration: "15 hours",
        isFree: false,
        rating: 4.6
      },
      {
        id: "c3",
        title: "FinOps Best Practices",
        type: "course",
        url: "#",
        duration: "18 hours",
        isFree: false,
        rating: 4.8
      }
    ],
    milestones: [
      {
        id: "c1",
        title: "Implement Cost Monitoring",
        description: "Set up comprehensive cost tracking and alerting",
        isCompleted: false
      },
      {
        id: "c2",
        title: "Optimize Resource Utilization",
        description: "Right-size instances and implement auto-scaling",
        isCompleted: false
      },
      {
        id: "c3",
        title: "Design Cost-Effective Architecture",
        description: "Create architectures that balance performance and cost",
        isCompleted: false
      }
    ]
  },
  {
    id: "multi-cloud",
    title: "Multi-Cloud & Hybrid Architecture",
    description: "Design architectures that span multiple cloud providers and on-premises",
    duration: "6-8 weeks",
    order: 5,
    isCompleted: false,
    isCurrent: false,
    icon: Network,
    color: "from-purple-500 to-purple-600",
    skills: ["Multi-Cloud", "Hybrid Cloud", "Cloud Migration", "Vendor Management"],
    resources: [
      {
        id: "m1",
        title: "Multi-Cloud Architecture Design",
        type: "course",
        url: "#",
        duration: "25 hours",
        isFree: false,
        rating: 4.8
      },
      {
        id: "m2",
        title: "Azure & GCP Fundamentals",
        type: "course",
        url: "#",
        duration: "30 hours",
        isFree: false,
        rating: 4.7
      },
      {
        id: "m3",
        title: "Cloud Migration Strategies",
        type: "course",
        url: "#",
        duration: "22 hours",
        isFree: false,
        rating: 4.6
      }
    ],
    milestones: [
      {
        id: "m1",
        title: "Design Multi-Cloud Strategy",
        description: "Create architectures that leverage multiple cloud providers",
        isCompleted: false
      },
      {
        id: "m2",
        title: "Implement Hybrid Cloud",
        description: "Connect on-premises and cloud environments seamlessly",
        isCompleted: false
      },
      {
        id: "m3",
        title: "Execute Cloud Migration",
        description: "Plan and execute large-scale cloud migration projects",
        isCompleted: false
      }
    ]
  },
  {
    id: "advanced-architecture",
    title: "Advanced Architecture Patterns",
    description: "Master advanced architectural patterns and emerging technologies",
    duration: "8-10 weeks",
    order: 6,
    isCompleted: false,
    isCurrent: false,
    icon: Layers,
    color: "from-indigo-500 to-indigo-600",
    skills: ["Microservices", "Event-Driven Architecture", "Serverless", "AI/ML Integration"],
    resources: [
      {
        id: "a1",
        title: "Advanced Cloud Architecture Patterns",
        type: "course",
        url: "#",
        duration: "35 hours",
        isFree: false,
        rating: 4.9
      },
      {
        id: "a2",
        title: "AWS Solutions Architect Professional",
        type: "certification",
        url: "#",
        duration: "50 hours",
        isFree: false,
        rating: 4.8
      },
      {
        id: "a3",
        title: "Serverless Architecture Mastery",
        type: "course",
        url: "#",
        duration: "28 hours",
        isFree: false,
        rating: 4.7
      }
    ],
    milestones: [
      {
        id: "a1",
        title: "Design Microservices Architecture",
        description: "Create scalable microservices-based systems",
        isCompleted: false
      },
      {
        id: "a2",
        title: "Implement Event-Driven Systems",
        description: "Build reactive and event-driven architectures",
        isCompleted: false
      },
      {
        id: "a3",
        title: "Achieve Professional Certification",
        description: "Pass AWS Solutions Architect Professional exam",
        isCompleted: false
      }
    ]
  }
];

export default function CloudArchitectPath() {
  const [expandedStage, setExpandedStage] = useState<string | null>("foundation");
  const { toast } = useToast();

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "course":
        return <BookOpen className="h-4 w-4" />;
      case "book":
        return <BookOpen className="h-4 w-4" />;
      case "video":
        return <Play className="h-4 w-4" />;
      case "practice":
        return <Target className="h-4 w-4" />;
      case "certification":
        return <Award className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const toggleStageExpansion = (stageId: string) => {
    setExpandedStage(expandedStage === stageId ? null : stageId);
  };

  const startLearningPath = () => {
    toast({
      title: "Cloud Architect Learning Path Started!",
      description: "You've begun your journey to become a Cloud Architect. Let's design the future!",
    });
  };

  const completedStages = cloudArchitectStages.filter(stage => stage.isCompleted).length;
  const totalStages = cloudArchitectStages.length;
  const progressPercentage = (completedStages / totalStages) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-teal-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/dashboard/learning-paths">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Learning Paths
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-green-600 to-teal-600 rounded-2xl">
              <Building className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Cloud Architect</h1>
              <p className="text-xl text-slate-600 dark:text-slate-400">Design scalable, secure, and cost-effective cloud solutions</p>
            </div>
          </div>

          {/* Path Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full w-fit mx-auto mb-3">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">8-15</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Months</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full w-fit mx-auto mb-3">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">6</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Stages</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full w-fit mx-auto mb-3">
                  <BookOpen className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">18</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Resources</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full w-fit mx-auto mb-3">
                  <Award className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">3</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Certifications</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Progress Overview */}
        {/* <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">Learning Progress</CardTitle>
                <p className="text-slate-600 dark:text-slate-400">Track your journey to becoming a Cloud Architect</p>
              </div>
              <Button
                onClick={startLearningPath}
                className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white"
              >
                <Play className="mr-2 h-4 w-4" />
                Start Learning Path
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Overall Progress</span>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {completedStages}/{totalStages} stages completed
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
            </div>
          </CardContent>
        </Card> */}

        {/* Learning Stages */}
        <div className="space-y-6">
          {cloudArchitectStages.map((stage, index) => {
            const IconComponent = stage.icon;
            return (
              <Card
                key={stage.id}
                className={`border-2 transition-all duration-200 ${
                  stage.isCurrent
                    ? "border-green-500 bg-green-50 dark:bg-green-900/50"
                    : stage.isCompleted
                    ? "border-green-500 bg-green-50 dark:bg-green-900/50"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                }`}
              >
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => toggleStageExpansion(stage.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className={`p-4 bg-gradient-to-br ${stage.color} rounded-2xl shadow-lg`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                            Stage {stage.order}: {stage.title}
                          </h3>
                          {stage.isCompleted && (
                            <CheckCircle className="h-6 w-6 text-green-500" />
                          )}
                          {stage.isCurrent && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                              Current
                            </Badge>
                          )}
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 mb-3">
                          {stage.description}
                        </p>
                        <div className="flex items-center gap-6 text-sm text-slate-500">
                          <span className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {stage.duration}
                          </span>
                          <span className="flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            {stage.milestones.length} milestones
                          </span>
                          <span className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            {stage.resources.length} resources
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-wrap gap-2">
                        {stage.skills.slice(0, 4).map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {stage.skills.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{stage.skills.length - 4}
                          </Badge>
                        )}
                      </div>
                      {expandedStage === stage.id ? (
                        <ChevronUp className="h-6 w-6 text-slate-400" />
                      ) : (
                        <ChevronDown className="h-6 w-6 text-slate-400" />
                      )}
                    </div>
                  </div>
                </div>

                {expandedStage === stage.id && (
                  <div className="border-t border-slate-200 dark:border-slate-700 p-6 bg-slate-50 dark:bg-slate-700/50">
                    <div className="grid lg:grid-cols-2 gap-8">
                      {/* Milestones */}
                      <div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                          <Target className="h-5 w-5" />
                          Learning Milestones
                        </h4>
                        <div className="space-y-3">
                          {stage.milestones.map((milestone) => (
                            <div
                              key={milestone.id}
                              className={`flex items-start gap-3 p-3 rounded-lg ${
                                milestone.isCompleted
                                  ? "bg-green-100 dark:bg-green-800/50"
                                  : "bg-white dark:bg-slate-800"
                              }`}
                            >
                              <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex-shrink-0 ${
                                milestone.isCompleted
                                  ? "bg-green-500 border-green-500"
                                  : "border-slate-300 dark:border-slate-600"
                              }`}>
                                {milestone.isCompleted && (
                                  <CheckCircle className="h-4 w-4 text-white" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-slate-900 dark:text-white">
                                  {milestone.title}
                                </p>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                  {milestone.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Resources */}
                      <div>
                        <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                          <BookOpen className="h-5 w-5" />
                          Learning Resources
                        </h4>
                        <div className="space-y-3">
                          {stage.resources.map((resource) => (
                            <div
                              key={resource.id}
                              className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                              onClick={() => window.open(resource.url, '_blank')}
                            >
                              <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                {getResourceIcon(resource.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-900 dark:text-white truncate">
                                  {resource.title}
                                </p>
                                <div className="flex items-center gap-3 text-sm text-slate-500">
                                  {resource.duration && <span>{resource.duration}</span>}
                                  <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    <span>{resource.rating}</span>
                                  </div>
                                  {resource.isFree && (
                                    <Badge variant="outline" className="text-xs">
                                      Free
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <ExternalLink className="h-4 w-4 text-slate-400" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-green-600 to-teal-600 text-white">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">Ready to Design the Future?</h2>
              <p className="text-green-100 mb-6 max-w-2xl mx-auto text-lg">
                Join elite architects who are building the next generation of cloud infrastructure and applications.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-green-600 hover:bg-green-50"
                  onClick={startLearningPath}
                >
                  <Play className="mr-2 h-5 w-5" />
                  Start Learning Now
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download Study Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}







