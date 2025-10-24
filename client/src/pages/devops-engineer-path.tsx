import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import {
  ArrowLeft,
  Zap,
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
  Building,
  Lock,
  Network,
  Layers,
  Cpu,
  Globe,
  Terminal,
  GitCommit,
  Workflow,
  Activity
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

const devOpsStages: PathStage[] = [
  {
    id: "foundation",
    title: "Foundation & Fundamentals",
    description: "Build the foundational knowledge required for DevOps practices",
    duration: "4-6 weeks",
    order: 1,
    isCompleted: false,
    isCurrent: true,
    icon: BookOpen,
    color: "from-blue-500 to-blue-600",
    skills: ["Linux Basics", "Networking", "Version Control", "Scripting"],
    resources: [
      {
        id: "f1",
        title: "Linux Command Line Mastery",
        type: "course",
        url: "#",
        duration: "15 hours",
        isFree: false,
        rating: 4.8
      },
      {
        id: "f2",
        title: "Git & GitHub Complete Guide",
        type: "video",
        url: "#",
        duration: "12 hours",
        isFree: true,
        rating: 4.7
      },
      {
        id: "f3",
        title: "Bash Scripting Fundamentals",
        type: "course",
        url: "#",
        duration: "10 hours",
        isFree: false,
        rating: 4.6
      }
    ],
    milestones: [
      {
        id: "f1",
        title: "Master Linux Command Line",
        description: "Navigate file systems, manage processes, and automate tasks",
        isCompleted: false
      },
      {
        id: "f2",
        title: "Set up Git Repository",
        description: "Create repositories, manage branches, and collaborate effectively",
        isCompleted: false
      },
      {
        id: "f3",
        title: "Write Automation Scripts",
        description: "Create shell scripts for common DevOps tasks",
        isCompleted: false
      }
    ]
  },
  {
    id: "automation",
    title: "Automation & Infrastructure as Code",
    description: "Master automation tools and infrastructure management",
    duration: "6-8 weeks",
    order: 2,
    isCompleted: false,
    isCurrent: false,
    icon: Zap,
    color: "from-purple-500 to-purple-600",
    skills: ["Terraform", "Ansible", "Python", "Infrastructure as Code"],
    resources: [
      {
        id: "a1",
        title: "Terraform Infrastructure as Code",
        type: "course",
        url: "#",
        duration: "25 hours",
        isFree: false,
        rating: 4.9
      },
      {
        id: "a2",
        title: "Ansible Automation Platform",
        type: "course",
        url: "#",
        duration: "20 hours",
        isFree: false,
        rating: 4.7
      },
      {
        id: "a3",
        title: "Python for DevOps",
        type: "course",
        url: "#",
        duration: "18 hours",
        isFree: false,
        rating: 4.8
      }
    ],
    milestones: [
      {
        id: "a1",
        title: "Deploy Infrastructure with Terraform",
        description: "Create and manage cloud infrastructure using code",
        isCompleted: false
      },
      {
        id: "a2",
        title: "Configure Servers with Ansible",
        description: "Automate server configuration and management",
        isCompleted: false
      },
      {
        id: "a3",
        title: "Build Python Automation Tools",
        description: "Create custom automation scripts and tools",
        isCompleted: false
      }
    ]
  },
  {
    id: "containers",
    title: "Containerization & Orchestration",
    description: "Master Docker and Kubernetes for scalable deployments",
    duration: "6-8 weeks",
    order: 3,
    isCompleted: false,
    isCurrent: false,
    icon: Container,
    color: "from-green-500 to-green-600",
    skills: ["Docker", "Kubernetes", "Container Security", "Microservices"],
    resources: [
      {
        id: "c1",
        title: "Docker Complete Guide",
        type: "course",
        url: "#",
        duration: "22 hours",
        isFree: false,
        rating: 4.8
      },
      {
        id: "c2",
        title: "Kubernetes Administration",
        type: "course",
        url: "#",
        duration: "35 hours",
        isFree: false,
        rating: 4.9
      },
      {
        id: "c3",
        title: "Container Security Best Practices",
        type: "course",
        url: "#",
        duration: "15 hours",
        isFree: false,
        rating: 4.6
      }
    ],
    milestones: [
      {
        id: "c1",
        title: "Build and Deploy Docker Containers",
        description: "Create optimized container images and run applications",
        isCompleted: false
      },
      {
        id: "c2",
        title: "Set up Kubernetes Cluster",
        description: "Deploy and manage applications on Kubernetes",
        isCompleted: false
      },
      {
        id: "c3",
        title: "Implement Container Security",
        description: "Secure containerized applications and infrastructure",
        isCompleted: false
      }
    ]
  },
  {
    id: "cicd",
    title: "CI/CD Pipelines",
    description: "Design and implement continuous integration and deployment",
    duration: "6-8 weeks",
    order: 4,
    isCompleted: false,
    isCurrent: false,
    icon: GitBranch,
    color: "from-orange-500 to-orange-600",
    skills: ["Jenkins", "GitLab CI", "GitHub Actions", "Pipeline Design"],
    resources: [
      {
        id: "ci1",
        title: "Jenkins Pipeline Mastery",
        type: "course",
        url: "#",
        duration: "20 hours",
        isFree: false,
        rating: 4.7
      },
      {
        id: "ci2",
        title: "GitLab CI/CD Complete Guide",
        type: "course",
        url: "#",
        duration: "18 hours",
        isFree: false,
        rating: 4.8
      },
      {
        id: "ci3",
        title: "GitHub Actions Workflows",
        type: "course",
        url: "#",
        duration: "16 hours",
        isFree: false,
        rating: 4.6
      }
    ],
    milestones: [
      {
        id: "ci1",
        title: "Build Jenkins Pipeline",
        description: "Create automated build, test, and deployment pipelines",
        isCompleted: false
      },
      {
        id: "ci2",
        title: "Implement Blue-Green Deployment",
        description: "Set up zero-downtime deployment strategies",
        isCompleted: false
      },
      {
        id: "ci3",
        title: "Automate Testing in Pipeline",
        description: "Integrate comprehensive testing in CI/CD process",
        isCompleted: false
      }
    ]
  },
  {
    id: "monitoring",
    title: "Monitoring & Observability",
    description: "Implement comprehensive monitoring and logging solutions",
    duration: "4-6 weeks",
    order: 5,
    isCompleted: false,
    isCurrent: false,
    icon: Monitor,
    color: "from-teal-500 to-teal-600",
    skills: ["Prometheus", "Grafana", "ELK Stack", "APM Tools"],
    resources: [
      {
        id: "m1",
        title: "Prometheus & Grafana Mastery",
        type: "course",
        url: "#",
        duration: "25 hours",
        isFree: false,
        rating: 4.8
      },
      {
        id: "m2",
        title: "ELK Stack for Logging",
        type: "course",
        url: "#",
        duration: "20 hours",
        isFree: false,
        rating: 4.7
      },
      {
        id: "m3",
        title: "Application Performance Monitoring",
        type: "course",
        url: "#",
        duration: "15 hours",
        isFree: false,
        rating: 4.6
      }
    ],
    milestones: [
      {
        id: "m1",
        title: "Set up Monitoring Dashboard",
        description: "Create comprehensive monitoring with Prometheus and Grafana",
        isCompleted: false
      },
      {
        id: "m2",
        title: "Implement Centralized Logging",
        description: "Configure ELK stack for log aggregation and analysis",
        isCompleted: false
      },
      {
        id: "m3",
        title: "Create Alerting System",
        description: "Set up automated alerts for system issues and anomalies",
        isCompleted: false
      }
    ]
  },
  {
    id: "cloud",
    title: "Cloud Platform Mastery",
    description: "Deep dive into AWS DevOps services and best practices",
    duration: "8-10 weeks",
    order: 6,
    isCompleted: false,
    isCurrent: false,
    icon: Cloud,
    color: "from-indigo-500 to-indigo-600",
    skills: ["AWS DevOps", "CloudFormation", "CodePipeline", "Cloud Security"],
    resources: [
      {
        id: "cl1",
        title: "AWS DevOps Engineer Professional",
        type: "certification",
        url: "#",
        duration: "50 hours",
        isFree: false,
        rating: 4.9
      },
      {
        id: "cl2",
        title: "AWS CodePipeline & CodeDeploy",
        type: "course",
        url: "#",
        duration: "25 hours",
        isFree: false,
        rating: 4.7
      },
      {
        id: "cl3",
        title: "AWS CloudFormation Templates",
        type: "course",
        url: "#",
        duration: "20 hours",
        isFree: false,
        rating: 4.8
      }
    ],
    milestones: [
      {
        id: "cl1",
        title: "Deploy Multi-Tier Application on AWS",
        description: "Build and deploy scalable applications using AWS services",
        isCompleted: false
      },
      {
        id: "cl2",
        title: "Implement Infrastructure as Code",
        description: "Manage cloud infrastructure using CloudFormation and Terraform",
        isCompleted: false
      },
      {
        id: "cl3",
        title: "Achieve AWS DevOps Certification",
        description: "Pass the AWS Certified DevOps Engineer - Professional exam",
        isCompleted: false
      }
    ]
  }
];

export default function DevOpsEngineerPath() {
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
      title: "DevOps Learning Path Started!",
      description: "You've begun your journey to become a DevOps Engineer. Let's build the future!",
    });
  };

  const completedStages = devOpsStages.filter(stage => stage.isCompleted).length;
  const totalStages = devOpsStages.length;
  const progressPercentage = (completedStages / totalStages) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
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
            <div className="p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl">
              <Zap className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">DevOps Engineer</h1>
              <p className="text-xl text-slate-600 dark:text-slate-400">Master CI/CD, automation, and infrastructure management</p>
            </div>
          </div>

          {/* Path Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full w-fit mx-auto mb-3">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">6-12</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Months</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full w-fit mx-auto mb-3">
                  <Target className="h-6 w-6 text-green-600" />
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
                <p className="text-slate-600 dark:text-slate-400">Track your journey to becoming a DevOps Engineer</p>
              </div>
              <Button
                onClick={startLearningPath}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
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
          {devOpsStages.map((stage, index) => {
            const IconComponent = stage.icon;
            return (
              <Card
                key={stage.id}
                className={`border-2 transition-all duration-200 ${
                  stage.isCurrent
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/50"
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
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
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
          <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Your DevOps Journey?</h2>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto text-lg">
                Join thousands of professionals who have transformed their careers with our comprehensive DevOps learning path.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50"
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













