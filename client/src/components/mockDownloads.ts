import {
  Cloud,
  Zap,
  Container,
  Settings,
  Shield,
  Building,
  Monitor,
  GitBranch,
  Database
} from "lucide-react";

export interface DownloadableFile {
  id: string;
  title: string;
  description: string;
  category: string;
  fileSize: string;
  downloadCount: number;
  rating: number;
  uploadDate: string;
  author: string;
  tags: string[];
  isPopular: boolean;
  isNew: boolean;
  isFree: boolean;
  thumbnail?: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  fileName: string;
}

export const mockDownloads: DownloadableFile[] = [
  {
    id: "essential-linux-commands-for-devops-engineers",
    title: "Essential Linux Commands for devops engineer",
    description: "This cheat sheet provides a comprehensive reference of essential Linux commands frequently used by DevOps engineers for system administration, automation, and troubleshooting",
    category: "Linux",
    fileSize: "2.4 MB",
    downloadCount: 15420,
    rating: 4.9,
    uploadDate: "2024-01-15",
    author: "Cloud in Depth Team",
    tags: ["aws", "reference", "cheat-sheet", "services"],
    isPopular: false,
    isNew: false,
    isFree: false,
    icon: Cloud,
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950",
    borderColor: "border-orange-200 dark:border-orange-800",
    fileName: "essential-linux-commands-for-devops-engineers.pdf"
  },
  {
    id: "devops-roadmap",
    title: "Study Notes for AWS Solutions Architect Associate",
    description: "Complete learning path and roadmap for becoming a DevOps engineer with modern tools and practices.",
    category: "AWS",
    fileSize: "3.1 MB",
    downloadCount: 12850,
    rating: 4.8,
    uploadDate: "2024-01-10",
    author: "DevOps Experts",
    tags: ["devops", "roadmap", "career", "learning"],
    isPopular: false,
    isNew: false,
    isFree: false,
    icon: Zap,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950",
    borderColor: "border-blue-200 dark:border-blue-800",
    fileName: "saa-study-notes.pdf"
  }
];







