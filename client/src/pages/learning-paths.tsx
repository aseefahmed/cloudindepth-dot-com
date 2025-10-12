import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import {
  Map,
  Clock,
  Users,
  BookOpen,
  Award,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Target,
  Zap,
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
  Globe
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LearningPath {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  prerequisites: string[];
  skills: string[];
  certifications: string[];
  resources: Resource[];
  stages: PathStage[];
  estimatedTime: number; // in hours
  completionRate: number;
  isPopular: boolean;
}

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

const devOpsLearningPath: LearningPath = {
  id: "devops-professional",
  title: "Professional DevOps Engineer",
  description: "Complete roadmap to become a professional DevOps engineer with hands-on experience in CI/CD, infrastructure automation, and cloud platforms.",
  duration: "6-12 months",
  difficulty: "Intermediate",
  estimatedTime: 400,
  completionRate: 0,
  isPopular: true,
  prerequisites: [
    "Basic understanding of software development",
    "Familiarity with command line interface",
    "Basic knowledge of networking concepts",
    "Understanding of operating systems (Linux/Windows)"
  ],
  skills: [
    "CI/CD Pipeline Design",
    "Infrastructure as Code",
    "Container Orchestration",
    "Cloud Platform Management",
    "Monitoring & Logging",
    "Security Best Practices",
    "Automation Scripting",
    "Version Control"
  ],
  certifications: [
    "AWS Certified DevOps Engineer - Professional",
    "Azure DevOps Engineer Expert",
    "Google Cloud Professional DevOps Engineer",
    "Docker Certified Associate",
    "Kubernetes Administrator (CKA)"
  ],
  resources: [
    {
      id: "1",
      title: "AWS DevOps Engineer Professional Course",
      type: "course",
      url: "#",
      duration: "40 hours",
      isFree: false,
      rating: 4.8
    },
    {
      id: "2",
      title: "Docker Deep Dive",
      type: "book",
      url: "#",
      duration: "15 hours",
      isFree: false,
      rating: 4.6
    },
    {
      id: "3",
      title: "Kubernetes Fundamentals",
      type: "video",
      url: "#",
      duration: "20 hours",
      isFree: true,
      rating: 4.7
    }
  ],
  stages: [
    {
      id: "foundation",
      title: "Foundation & Fundamentals",
      description: "Build the foundational knowledge required for DevOps practices",
      duration: "4-6 weeks",
      order: 1,
      isCompleted: false,
      isCurrent: true,
      skills: ["Linux Basics", "Networking", "Version Control", "Scripting"],
      resources: [
        {
          id: "f1",
          title: "Linux Command Line Basics",
          type: "course",
          url: "#",
          duration: "10 hours",
          isFree: true,
          rating: 4.5
        },
        {
          id: "f2",
          title: "Git & GitHub Fundamentals",
          type: "video",
          url: "#",
          duration: "8 hours",
          isFree: true,
          rating: 4.7
        }
      ],
      milestones: [
        {
          id: "f1",
          title: "Complete Linux Basics Course",
          description: "Understand file system, permissions, and basic commands",
          isCompleted: false
        },
        {
          id: "f2",
          title: "Set up Git Repository",
          description: "Create and manage a Git repository with branching",
          isCompleted: false
        },
        {
          id: "f3",
          title: "Write Basic Shell Scripts",
          description: "Create automation scripts for common tasks",
          isCompleted: false
        }
      ]
    },
    {
      id: "automation",
      title: "Automation & Scripting",
      description: "Learn automation tools and scripting languages",
      duration: "6-8 weeks",
      order: 2,
      isCompleted: false,
      isCurrent: false,
      skills: ["Python/Bash Scripting", "Ansible", "Terraform", "Puppet"],
      resources: [
        {
          id: "a1",
          title: "Python for DevOps",
          type: "course",
          url: "#",
          duration: "25 hours",
          isFree: false,
          rating: 4.8
        },
        {
          id: "a2",
          title: "Terraform Infrastructure as Code",
          type: "course",
          url: "#",
          duration: "20 hours",
          isFree: false,
          rating: 4.6
        }
      ],
      milestones: [
        {
          id: "a1",
          title: "Master Python Scripting",
          description: "Write Python scripts for automation tasks",
          isCompleted: false
        },
        {
          id: "a2",
          title: "Deploy Infrastructure with Terraform",
          description: "Create and manage cloud infrastructure using Terraform",
          isCompleted: false
        },
        {
          id: "a3",
          title: "Configure Ansible Playbooks",
          description: "Automate server configuration with Ansible",
          isCompleted: false
        }
      ]
    },
    {
      id: "containers",
      title: "Containerization",
      description: "Master container technologies and orchestration",
      duration: "4-6 weeks",
      order: 3,
      isCompleted: false,
      isCurrent: false,
      skills: ["Docker", "Kubernetes", "Container Security", "Microservices"],
      resources: [
        {
          id: "c1",
          title: "Docker Complete Guide",
          type: "course",
          url: "#",
          duration: "15 hours",
          isFree: false,
          rating: 4.7
        },
        {
          id: "c2",
          title: "Kubernetes Administration",
          type: "course",
          url: "#",
          duration: "30 hours",
          isFree: false,
          rating: 4.8
        }
      ],
      milestones: [
        {
          id: "c1",
          title: "Build and Deploy Docker Containers",
          description: "Create Docker images and run containerized applications",
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
      skills: ["Jenkins", "GitLab CI", "GitHub Actions", "Pipeline Design"],
      resources: [
        {
          id: "ci1",
          title: "Jenkins Pipeline Mastery",
          type: "course",
          url: "#",
          duration: "20 hours",
          isFree: false,
          rating: 4.6
        },
        {
          id: "ci2",
          title: "GitLab CI/CD Complete Guide",
          type: "course",
          url: "#",
          duration: "18 hours",
          isFree: false,
          rating: 4.7
        }
      ],
      milestones: [
        {
          id: "ci1",
          title: "Build Jenkins Pipeline",
          description: "Create automated build and test pipelines",
          isCompleted: false
        },
        {
          id: "ci2",
          title: "Implement Blue-Green Deployment",
          description: "Set up zero-downtime deployment strategy",
          isCompleted: false
        },
        {
          id: "ci3",
          title: "Automate Testing in Pipeline",
          description: "Integrate automated testing in CI/CD process",
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
      skills: ["Prometheus", "Grafana", "ELK Stack", "APM Tools"],
      resources: [
        {
          id: "m1",
          title: "Prometheus & Grafana Mastery",
          type: "course",
          url: "#",
          duration: "22 hours",
          isFree: false,
          rating: 4.8
        },
        {
          id: "m2",
          title: "ELK Stack for Logging",
          type: "course",
          url: "#",
          duration: "16 hours",
          isFree: false,
          rating: 4.5
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
          description: "Set up automated alerts for system issues",
          isCompleted: false
        }
      ]
    },
    {
      id: "cloud",
      title: "Cloud Platform Mastery",
      description: "Deep dive into cloud platforms and services",
      duration: "8-10 weeks",
      order: 6,
      isCompleted: false,
      isCurrent: false,
      skills: ["AWS Services", "Azure DevOps", "GCP", "Cloud Security"],
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
          title: "Azure DevOps Services",
          type: "course",
          url: "#",
          duration: "35 hours",
          isFree: false,
          rating: 4.7
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
          description: "Manage cloud infrastructure using code",
          isCompleted: false
        },
        {
          id: "cl3",
          title: "Achieve Cloud Certification",
          description: "Pass professional-level cloud certification exam",
          isCompleted: false
        }
      ]
    }
  ]
};

const learningPathOptions = [
  {
    id: "devops-engineer",
    title: "DevOps Engineer",
    description: "Master CI/CD, automation, and infrastructure management",
    icon: Zap,
    color: "from-blue-600 to-purple-600",
    bgColor: "bg-blue-50 dark:bg-blue-950",
    borderColor: "border-blue-200 dark:border-blue-800",
    path: "/dashboard/learning-paths/devops-engineer",
    duration: "6-12 months",
    difficulty: "Intermediate",
    skills: ["CI/CD", "Automation", "Containers", "Monitoring"],
    isPopular: true
  },
  {
    id: "cloud-architect",
    title: "Cloud Architect",
    description: "Design scalable, secure, and cost-effective cloud solutions",
    icon: Building,
    color: "from-green-600 to-teal-600",
    bgColor: "bg-green-50 dark:bg-green-950",
    borderColor: "border-green-200 dark:border-green-800",
    path: "/dashboard/learning-paths/cloud-architect",
    duration: "8-15 months",
    difficulty: "Advanced",
    skills: ["Architecture", "Scalability", "Cost Optimization", "Multi-Cloud"],
    isPopular: true
  },
  {
    id: "security-specialist",
    title: "Security Specialist",
    description: "Become an expert in cloud security and compliance",
    icon: Shield,
    color: "from-red-600 to-orange-600",
    bgColor: "bg-red-50 dark:bg-red-950",
    borderColor: "border-red-200 dark:border-red-800",
    path: "/dashboard/learning-paths/security-specialist",
    duration: "6-10 months",
    difficulty: "Advanced",
    skills: ["Security", "Compliance", "Risk Management", "Incident Response"],
    isPopular: false
  }
];

export default function LearningPaths() {
  const [selectedPath, setSelectedPath] = useState<LearningPath>(devOpsLearningPath);
  const [expandedStage, setExpandedStage] = useState<string | null>("foundation");
  const [selectedStage, setSelectedStage] = useState<string>("foundation");
  
  const { toast } = useToast();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

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

  const getStageIcon = (stageId: string) => {
    switch (stageId) {
      case "foundation":
        return <BookOpen className="h-6 w-6" />;
      case "automation":
        return <Zap className="h-6 w-6" />;
      case "containers":
        return <Container className="h-6 w-6" />;
      case "cicd":
        return <GitBranch className="h-6 w-6" />;
      case "monitoring":
        return <Monitor className="h-6 w-6" />;
      case "cloud":
        return <Cloud className="h-6 w-6" />;
      default:
        return <Target className="h-6 w-6" />;
    }
  };

  const toggleStageExpansion = (stageId: string) => {
    setExpandedStage(expandedStage === stageId ? null : stageId);
  };

  const startLearningPath = () => {
    toast({
      title: "Learning Path Started!",
      description: "You've begun your journey to become a DevOps Engineer. Good luck!",
    });
  };

  const currentStage = selectedPath.stages.find(stage => stage.isCurrent);
  const completedStages = selectedPath.stages.filter(stage => stage.isCompleted).length;
  const totalStages = selectedPath.stages.length;
  const progressPercentage = (completedStages / totalStages) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
              <Map className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Learning Paths</h1>
              <p className="text-xl text-slate-600 dark:text-slate-400">Choose your specialization and start your journey to becoming a cloud professional</p>
            </div>
          </div>
        </div>

        {/* Learning Path Options */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {learningPathOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <Link key={option.id} href={option.path}>
                <Card className={`border-2 ${option.borderColor} ${option.bgColor} hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer group`}>
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                      <div className={`p-4 bg-gradient-to-br ${option.color} rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
                        {option.title}
                      </CardTitle>
                      {option.isPopular && (
                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          <Star className="h-3 w-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      {option.description}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {/* Duration and Difficulty */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-slate-500" />
                          <span className="text-slate-600 dark:text-slate-400">{option.duration}</span>
                        </div>
                        <Badge className={getDifficultyColor(option.difficulty)}>
                          {option.difficulty}
                        </Badge>
                      </div>

                      {/* Skills */}
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Key Skills:</h4>
                        <div className="flex flex-wrap gap-1">
                          {option.skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* CTA Button */}
                      <Button 
                        className={`w-full bg-gradient-to-r ${option.color} hover:opacity-90 text-white font-semibold group-hover:shadow-lg transition-all duration-300`}
                      >
                        <ArrowRight className="mr-2 h-4 w-4" />
                        Read More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full w-fit mx-auto mb-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">2,500+</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Students Enrolled</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full w-fit mx-auto mb-3">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">95%</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Success Rate</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full w-fit mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">$120K</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Avg. Salary</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full w-fit mx-auto mb-3">
                <Globe className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">50+</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Countries</p>
            </CardContent>
          </Card>
        </div>

        {/* Why Choose Our Learning Paths */}
        <Card className="border-0 shadow-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white text-center">
              Why Choose Our Learning Paths?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full w-fit mx-auto mb-4">
                  <Target className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Industry-Focused</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Curated by industry experts with real-world experience in top tech companies
                </p>
              </div>
              <div className="text-center">
                <div className="p-4 bg-green-100 dark:bg-green-900 rounded-full w-fit mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Hands-On Learning</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Practical projects and labs that mirror real-world scenarios and challenges
                </p>
              </div>
              <div className="text-center">
                <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded-full w-fit mx-auto mb-4">
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Certification Ready</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Prepare for industry-recognized certifications with comprehensive exam prep
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
