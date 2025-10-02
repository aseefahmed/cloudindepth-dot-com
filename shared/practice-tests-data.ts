export interface PracticeTest {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  questions: number;
  duration: string;
  rating: number;
  reviews: number;
  difficulty: "Associate" | "Professional" | "Specialty";
  features: string[];
  popular?: boolean;
}

export const practiceTestsData: PracticeTest[] = [
  {
    id: "saa-c03",
    title: "AWS Certified Solutions Architect",
    subtitle: "Associate (SAA-C03)",
    price: 49,
    questions: 390,
    duration: "65 mins per test",
    rating: 4.8,
    reviews: 1250,
    difficulty: "Associate",
    features: [
      "6 full-length practice tests",
      "Detailed explanations for all answers",
      "Performance tracking dashboard",
      "Mobile-friendly interface"
    ],
    popular: true
  },
  {
    id: "sap-c02",
    title: "AWS Certified Solutions Architect",
    subtitle: "Professional (SAP-C02)",
    price: 69,
    questions: 450,
    duration: "75 mins per test",
    rating: 4.9,
    reviews: 890,
    difficulty: "Professional",
    features: [
      "6 full-length practice tests",
      "Advanced scenario-based questions",
      "Exam tips and strategies",
      "Lifetime access to updates"
    ]
  },
  {
    id: "dva-c02",
    title: "AWS Certified Developer",
    subtitle: "Associate (DVA-C02)",
    price: 45,
    questions: 325,
    duration: "65 mins per test",
    rating: 4.7,
    reviews: 1100,
    difficulty: "Associate",
    features: [
      "5 full-length practice tests",
      "Code-based questions included",
      "Video explanations available",
      "Practice mode & timed mode"
    ]
  },
  {
    id: "soa-c02",
    title: "AWS Certified SysOps Administrator",
    subtitle: "Associate (SOA-C02)",
    price: 45,
    questions: 300,
    duration: "65 mins per test",
    rating: 4.6,
    reviews: 780,
    difficulty: "Associate",
    features: [
      "5 full-length practice tests",
      "Hands-on lab scenarios",
      "Performance analytics",
      "Study mode available"
    ]
  },
  {
    id: "dop-c02",
    title: "AWS Certified DevOps Engineer",
    subtitle: "Professional (DOP-C02)",
    price: 69,
    questions: 425,
    duration: "75 mins per test",
    rating: 4.8,
    reviews: 650,
    difficulty: "Professional",
    features: [
      "6 full-length practice tests",
      "CI/CD scenario questions",
      "Infrastructure as Code focus",
      "Expert-level explanations"
    ],
    popular: true
  },
  {
    id: "ans-c01",
    title: "AWS Certified Advanced Networking",
    subtitle: "Specialty (ANS-C01)",
    price: 59,
    questions: 325,
    duration: "65 mins per test",
    rating: 4.7,
    reviews: 420,
    difficulty: "Specialty",
    features: [
      "5 full-length practice tests",
      "Network architecture scenarios",
      "Hybrid connectivity questions",
      "VPC deep-dive questions"
    ]
  },
  {
    id: "scs-c02",
    title: "AWS Certified Security",
    subtitle: "Specialty (SCS-C02)",
    price: 59,
    questions: 325,
    duration: "65 mins per test",
    rating: 4.9,
    reviews: 580,
    difficulty: "Specialty",
    features: [
      "5 full-length practice tests",
      "Security best practices focus",
      "Compliance scenarios included",
      "IAM & encryption deep-dive"
    ]
  },
  {
    id: "dbs-c01",
    title: "AWS Certified Database",
    subtitle: "Specialty (DBS-C01)",
    price: 59,
    questions: 325,
    duration: "65 mins per test",
    rating: 4.6,
    reviews: 390,
    difficulty: "Specialty",
    features: [
      "5 full-length practice tests",
      "Database migration scenarios",
      "Performance optimization focus",
      "Multi-DB service coverage"
    ]
  },
  {
    id: "mls-c01",
    title: "AWS Certified Machine Learning",
    subtitle: "Specialty (MLS-C01)",
    price: 59,
    questions: 325,
    duration: "65 mins per test",
    rating: 4.8,
    reviews: 510,
    difficulty: "Specialty",
    features: [
      "5 full-length practice tests",
      "ML algorithms & frameworks",
      "SageMaker deep-dive",
      "Real-world ML scenarios"
    ],
    popular: true
  },
  {
    id: "das-c01",
    title: "AWS Certified Data Analytics",
    subtitle: "Specialty (DAS-C01)",
    price: 59,
    questions: 325,
    duration: "65 mins per test",
    rating: 4.7,
    reviews: 460,
    difficulty: "Specialty",
    features: [
      "5 full-length practice tests",
      "Big data architecture focus",
      "Analytics service coverage",
      "ETL pipeline scenarios"
    ]
  },
  {
    id: "sap-bundle",
    title: "Solutions Architect Bundle",
    subtitle: "Associate + Professional",
    price: 99,
    questions: 840,
    duration: "Multiple tests",
    rating: 4.9,
    reviews: 320,
    difficulty: "Professional",
    features: [
      "Both SAA-C03 & SAP-C02 tests",
      "Save $19 on bundle",
      "Complete learning path",
      "Priority email support"
    ]
  },
  {
    id: "cloud-practitioner",
    title: "AWS Certified Cloud Practitioner",
    subtitle: "Foundational (CLF-C02)",
    price: 35,
    questions: 260,
    duration: "65 mins per test",
    rating: 4.8,
    reviews: 1850,
    difficulty: "Associate",
    features: [
      "4 full-length practice tests",
      "Perfect for beginners",
      "Cloud concepts explained",
      "AWS service overview"
    ]
  }
];

export function getPracticeTestById(id: string): PracticeTest | undefined {
  return practiceTestsData.find(test => test.id === id);
}
