import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import {
  ArrowLeft,
  Shield,
  Clock,
  Users,
  BookOpen,
  Award,
  CheckCircle,
  ArrowRight,
  Play,
  Star,
  Target,
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
  Building,
  AlertTriangle,
  Eye,
  Key,
  FileCheck,
  Search,
  Bug,
  UserCheck,
  FileShield
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

const securitySpecialistStages: PathStage[] = [
  {
    id: "foundation",
    title: "Security Fundamentals & Threat Landscape",
    description: "Master cybersecurity fundamentals and understand modern threat landscapes",
    duration: "4-6 weeks",
    order: 1,
    isCompleted: false,
    isCurrent: true,
    icon: Shield,
    color: "from-red-500 to-red-600",
    skills: ["Cybersecurity Basics", "Threat Modeling", "Risk Assessment", "Security Frameworks"],
    resources: [
      {
        id: "f1",
        title: "Cybersecurity Fundamentals",
        type: "course",
        url: "#",
        duration: "20 hours",
        isFree: false,
        rating: 4.8
      },
      {
        id: "f2",
        title: "CISSP Certification Prep",
        type: "certification",
        url: "#",
        duration: "40 hours",
        isFree: false,
        rating: 4.9
      },
      {
        id: "f3",
        title: "OWASP Top 10 Security Risks",
        type: "book",
        url: "#",
        duration: "12 hours",
        isFree: true,
        rating: 4.7
      }
    ],
    milestones: [
      {
        id: "f1",
        title: "Understand Security Principles",
        description: "Master CIA triad, defense in depth, and security by design",
        isCompleted: false
      },
      {
        id: "f2",
        title: "Perform Threat Modeling",
        description: "Identify and assess security threats and vulnerabilities",
        isCompleted: false
      },
      {
        id: "f3",
        title: "Implement Security Frameworks",
        description: "Apply NIST, ISO 27001, and other security standards",
        isCompleted: false
      }
    ]
  },
  {
    id: "cloud-security",
    title: "Cloud Security Architecture",
    description: "Design and implement secure cloud architectures and controls",
    duration: "6-8 weeks",
    order: 2,
    isCompleted: false,
    isCurrent: false,
    icon: Cloud,
    color: "from-blue-500 to-blue-600",
    skills: ["Cloud Security", "Identity Management", "Data Protection", "Compliance"],
    resources: [
      {
        id: "cs1",
        title: "AWS Security Specialty",
        type: "certification",
        url: "#",
        duration: "35 hours",
        isFree: false,
        rating: 4.9
      },
      {
        id: "cs2",
        title: "Azure Security Engineer",
        type: "certification",
        url: "#",
        duration: "30 hours",
        isFree: false,
        rating: 4.8
      },
      {
        id: "cs3",
        title: "Cloud Security Architecture",
        type: "course",
        url: "#",
        duration: "25 hours",
        isFree: false,
        rating: 4.7
      }
    ],
    milestones: [
      {
        id: "cs1",
        title: "Design Secure Cloud Architecture",
        description: "Implement security controls and best practices in cloud environments",
        isCompleted: false
      },
      {
        id: "cs2",
        title: "Configure Identity & Access Management",
        description: "Set up comprehensive IAM policies and multi-factor authentication",
        isCompleted: false
      },
      {
        id: "cs3",
        title: "Implement Data Encryption",
        description: "Encrypt data at rest and in transit across cloud services",
        isCompleted: false
      }
    ]
  },
  {
    id: "network-security",
    title: "Network Security & Monitoring",
    description: "Secure network infrastructure and implement comprehensive monitoring",
    duration: "5-7 weeks",
    order: 3,
    isCompleted: false,
    isCurrent: false,
    icon: Network,
    color: "from-green-500 to-green-600",
    skills: ["Network Security", "Firewalls", "Intrusion Detection", "SIEM"],
    resources: [
      {
        id: "ns1",
        title: "Network Security Fundamentals",
        type: "course",
        url: "#",
        duration: "22 hours",
        isFree: false,
        rating: 4.7
      },
      {
        id: "ns2",
        title: "SIEM Implementation & Management",
        type: "course",
        url: "#",
        duration: "20 hours",
        isFree: false,
        rating: 4.8
      },
      {
        id: "ns3",
        title: "Firewall Configuration & Management",
        type: "course",
        url: "#",
        duration: "18 hours",
        isFree: false,
        rating: 4.6
      }
    ],
    milestones: [
      {
        id: "ns1",
        title: "Configure Network Security Controls",
        description: "Set up firewalls, VPNs, and network segmentation",
        isCompleted: false
      },
      {
        id: "ns2",
        title: "Implement SIEM Solution",
        description: "Deploy and configure security information and event management",
        isCompleted: false
      },
      {
        id: "ns3",
        title: "Set up Intrusion Detection",
        description: "Configure IDS/IPS systems and security monitoring",
        isCompleted: false
      }
    ]
  },
  {
    id: "application-security",
    title: "Application Security & DevSecOps",
    description: "Secure applications and integrate security into development processes",
    duration: "6-8 weeks",
    order: 4,
    isCompleted: false,
    isCurrent: false,
    icon: Code,
    color: "from-purple-500 to-purple-600",
    skills: ["App Security", "SAST/DAST", "DevSecOps", "Secure Coding"],
    resources: [
      {
        id: "as1",
        title: "Application Security Testing",
        type: "course",
        url: "#",
        duration: "25 hours",
        isFree: false,
        rating: 4.8
      },
      {
        id: "as2",
        title: "DevSecOps Implementation",
        type: "course",
        url: "#",
        duration: "22 hours",
        isFree: false,
        rating: 4.7
      },
      {
        id: "as3",
        title: "Secure Coding Practices",
        type: "course",
        url: "#",
        duration: "20 hours",
        isFree: false,
        rating: 4.6
      }
    ],
    milestones: [
      {
        id: "as1",
        title: "Implement SAST/DAST Tools",
        description: "Set up static and dynamic application security testing",
        isCompleted: false
      },
      {
        id: "as2",
        title: "Integrate Security in CI/CD",
        description: "Embed security checks and controls in development pipelines",
        isCompleted: false
      },
      {
        id: "as3",
        title: "Conduct Security Code Reviews",
        description: "Perform comprehensive security-focused code reviews",
        isCompleted: false
      }
    ]
  },
  {
    id: "incident-response",
    title: "Incident Response & Forensics",
    description: "Develop incident response capabilities and digital forensics skills",
    duration: "5-7 weeks",
    order: 5,
    isCompleted: false,
    isCurrent: false,
    icon: AlertTriangle,
    color: "from-orange-500 to-orange-600",
    skills: ["Incident Response", "Digital Forensics", "Malware Analysis", "Threat Hunting"],
    resources: [
      {
        id: "ir1",
        title: "Incident Response Planning",
        type: "course",
        url: "#",
        duration: "20 hours",
        isFree: false,
        rating: 4.7
      },
      {
        id: "ir2",
        title: "Digital Forensics Fundamentals",
        type: "course",
        url: "#",
        duration: "25 hours",
        isFree: false,
        rating: 4.8
      },
      {
        id: "ir3",
        title: "Malware Analysis Techniques",
        type: "course",
        url: "#",
        duration: "22 hours",
        isFree: false,
        rating: 4.6
      }
    ],
    milestones: [
      {
        id: "ir1",
        title: "Develop Incident Response Plan",
        description: "Create comprehensive incident response procedures and playbooks",
        isCompleted: false
      },
      {
        id: "ir2",
        title: "Conduct Digital Forensics",
        description: "Perform forensic analysis of security incidents",
        isCompleted: false
      },
      {
        id: "ir3",
        title: "Implement Threat Hunting",
        description: "Proactively search for threats and security anomalies",
        isCompleted: false
      }
    ]
  },
  {
    id: "compliance-governance",
    title: "Compliance & Security Governance",
    description: "Master compliance frameworks and security governance practices",
    duration: "6-8 weeks",
    order: 6,
    isCompleted: false,
    isCurrent: false,
    icon: FileCheck,
    color: "from-indigo-500 to-indigo-600",
    skills: ["Compliance", "Governance", "Risk Management", "Auditing"],
    resources: [
      {
        id: "cg1",
        title: "Security Governance & Risk Management",
        type: "course",
        url: "#",
        duration: "30 hours",
        isFree: false,
        rating: 4.8
      },
      {
        id: "cg2",
        title: "GDPR & Privacy Compliance",
        type: "course",
        url: "#",
        duration: "20 hours",
        isFree: false,
        rating: 4.7
      },
      {
        id: "cg3",
        title: "SOC 2 & ISO 27001 Implementation",
        type: "course",
        url: "#",
        duration: "25 hours",
        isFree: false,
        rating: 4.9
      }
    ],
    milestones: [
      {
        id: "cg1",
        title: "Implement Security Governance",
        description: "Establish security policies, procedures, and governance frameworks",
        isCompleted: false
      },
      {
        id: "cg2",
        title: "Achieve Compliance Certification",
        description: "Implement and maintain SOC 2, ISO 27001, or other compliance standards",
        isCompleted: false
      },
      {
        id: "cg3",
        title: "Conduct Security Audits",
        description: "Perform comprehensive security assessments and audits",
        isCompleted: false
      }
    ]
  }
];

export default function SecuritySpecialistPath() {
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
      title: "Security Specialist Learning Path Started!",
      description: "You've begun your journey to become a Security Specialist. Let's protect the future!",
    });
  };

  const completedStages = securitySpecialistStages.filter(stage => stage.isCompleted).length;
  const totalStages = securitySpecialistStages.length;
  const progressPercentage = (completedStages / totalStages) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
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
            <div className="p-4 bg-gradient-to-br from-red-600 to-orange-600 rounded-2xl">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Security Specialist</h1>
              <p className="text-xl text-slate-600 dark:text-slate-400">Become an expert in cloud security and compliance</p>
            </div>
          </div>

          {/* Path Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full w-fit mx-auto mb-3">
                  <Clock className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">6-10</h3>
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
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">4</h3>
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
                <p className="text-slate-600 dark:text-slate-400">Track your journey to becoming a Security Specialist</p>
              </div>
              <Button
                onClick={startLearningPath}
                className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white"
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
          {securitySpecialistStages.map((stage, index) => {
            const IconComponent = stage.icon;
            return (
              <Card
                key={stage.id}
                className={`border-2 transition-all duration-200 ${
                  stage.isCurrent
                    ? "border-red-500 bg-red-50 dark:bg-red-900/50"
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
                            <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
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
          <Card className="border-0 shadow-xl bg-gradient-to-r from-red-600 to-orange-600 text-white">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">Ready to Protect the Future?</h2>
              <p className="text-red-100 mb-6 max-w-2xl mx-auto text-lg">
                Join elite security professionals who are defending organizations against evolving cyber threats.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-red-600 hover:bg-red-50"
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







