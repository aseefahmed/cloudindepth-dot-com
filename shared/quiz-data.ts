export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  domain: string;
}

export interface QuizData {
  certificationId: string;
  certificationName: string;
  questions: QuizQuestion[];
}

export const quizQuestions: QuizData[] = [
  {
    certificationId: "saa-c03",
    certificationName: "AWS Solutions Architect Associate (SAA-C03)",
    questions: [
      {
        id: "saa-1",
        question: "A company needs to store data in Amazon S3 and must prevent any accidental deletion of objects. Which S3 feature should the solutions architect enable?",
        options: [
          "S3 Lifecycle policies",
          "S3 Versioning with MFA Delete",
          "S3 Cross-Region Replication",
          "S3 Transfer Acceleration"
        ],
        correctAnswer: 1,
        explanation: "S3 Versioning with MFA Delete provides an additional layer of security by requiring multi-factor authentication to delete object versions, preventing accidental deletions.",
        domain: "Design Secure Architectures"
      },
      {
        id: "saa-2",
        question: "An application requires low-latency access to data stored in Amazon S3. The data is accessed frequently for the first 30 days, then rarely accessed afterward. What is the most cost-effective storage solution?",
        options: [
          "S3 Standard for all data",
          "S3 Intelligent-Tiering",
          "S3 Standard with lifecycle policy to S3 Standard-IA after 30 days",
          "S3 One Zone-IA for all data"
        ],
        correctAnswer: 2,
        explanation: "Using S3 Standard with a lifecycle policy to transition to S3 Standard-IA after 30 days provides the best balance of performance and cost for this access pattern.",
        domain: "Design Cost-Optimized Architectures"
      },
      {
        id: "saa-3",
        question: "A web application uses an Application Load Balancer (ALB) and Auto Scaling group. Users report intermittent 5xx errors during peak times. What should be investigated first?",
        options: [
          "ALB access logs and target health checks",
          "CloudWatch metrics for the Auto Scaling group",
          "VPC Flow Logs",
          "AWS CloudTrail logs"
        ],
        correctAnswer: 0,
        explanation: "ALB access logs and target health checks provide direct insight into connection issues and unhealthy targets that could cause 5xx errors.",
        domain: "Design High-Performing Architectures"
      },
      {
        id: "saa-4",
        question: "A company wants to run a batch processing job that can be interrupted without issues. The job typically takes 4-6 hours to complete. What is the most cost-effective compute option?",
        options: [
          "On-Demand EC2 instances",
          "Reserved Instances",
          "Spot Instances",
          "Dedicated Hosts"
        ],
        correctAnswer: 2,
        explanation: "Spot Instances are the most cost-effective option for fault-tolerant, flexible workloads that can handle interruptions, offering up to 90% cost savings.",
        domain: "Design Cost-Optimized Architectures"
      },
      {
        id: "saa-5",
        question: "An application needs to process messages asynchronously with the ability to delay message delivery by up to 15 minutes. Which AWS service should be used?",
        options: [
          "Amazon SNS",
          "Amazon SQS with delay queues",
          "Amazon Kinesis",
          "AWS Step Functions"
        ],
        correctAnswer: 1,
        explanation: "Amazon SQS supports delay queues with a configurable delay of up to 15 minutes, making it perfect for deferred message processing.",
        domain: "Design Resilient Architectures"
      }
    ]
  },
  {
    certificationId: "dva-c02",
    certificationName: "AWS Developer Associate (DVA-C02)",
    questions: [
      {
        id: "dva-1",
        question: "A developer needs to deploy a Lambda function that processes images. The function requires more than 512 MB of temporary storage. What should the developer configure?",
        options: [
          "Increase Lambda memory allocation",
          "Use /tmp directory with ephemeral storage up to 10GB",
          "Attach an EBS volume to Lambda",
          "Store files in S3 during processing"
        ],
        correctAnswer: 1,
        explanation: "Lambda functions have a /tmp directory that can be configured with ephemeral storage up to 10GB for temporary file processing.",
        domain: "Development with AWS Services"
      },
      {
        id: "dva-2",
        question: "An application uses DynamoDB with on-demand capacity mode. What happens when the application suddenly receives 10x normal traffic?",
        options: [
          "DynamoDB throttles requests",
          "DynamoDB automatically scales to handle the load",
          "The table becomes unavailable",
          "Requests are queued automatically"
        ],
        correctAnswer: 1,
        explanation: "DynamoDB on-demand capacity mode automatically scales to accommodate workload changes without throttling.",
        domain: "Development with AWS Services"
      },
      {
        id: "dva-3",
        question: "A developer wants to enable X-Ray tracing for a Lambda function. What is the minimum configuration required?",
        options: [
          "Install X-Ray SDK and enable active tracing",
          "Only install X-Ray SDK",
          "Only enable active tracing in Lambda configuration",
          "Create a custom X-Ray sampling rule"
        ],
        correctAnswer: 0,
        explanation: "Both installing the X-Ray SDK in your code and enabling active tracing in Lambda configuration are required for X-Ray tracing.",
        domain: "Monitoring and Troubleshooting"
      },
      {
        id: "dva-4",
        question: "Which deployment strategy in CodeDeploy sends traffic to new instances gradually while keeping old instances running?",
        options: [
          "All-at-once",
          "Blue/Green",
          "Canary",
          "Rolling"
        ],
        correctAnswer: 1,
        explanation: "Blue/Green deployment maintains both old (blue) and new (green) environments, shifting traffic gradually or all at once, providing easy rollback.",
        domain: "Deployment"
      },
      {
        id: "dva-5",
        question: "A developer needs to store database credentials for an application running on EC2. What is the most secure approach?",
        options: [
          "Store in environment variables",
          "Hardcode in application configuration",
          "Use AWS Secrets Manager or Systems Manager Parameter Store",
          "Store in S3 bucket with encryption"
        ],
        correctAnswer: 2,
        explanation: "AWS Secrets Manager or Systems Manager Parameter Store are designed specifically for secure credential storage with automatic rotation and audit capabilities.",
        domain: "Security"
      }
    ]
  },
  {
    certificationId: "soa-c02",
    certificationName: "AWS SysOps Administrator Associate (SOA-C02)",
    questions: [
      {
        id: "soa-1",
        question: "An EC2 instance in a private subnet needs to download security patches from the internet. What is the minimum required configuration?",
        options: [
          "Internet Gateway only",
          "NAT Gateway in public subnet and route table update",
          "VPC Peering connection",
          "VPN connection"
        ],
        correctAnswer: 1,
        explanation: "A NAT Gateway in a public subnet with proper route table configuration allows private subnet instances to access the internet for outbound traffic.",
        domain: "Networking and Content Delivery"
      },
      {
        id: "soa-2",
        question: "A company needs to be alerted when an EC2 instance's CPU utilization exceeds 80% for 5 minutes. What should be configured?",
        options: [
          "CloudWatch alarm with SNS topic",
          "EventBridge rule with Lambda",
          "CloudTrail log with alarm",
          "Systems Manager automation"
        ],
        correctAnswer: 0,
        explanation: "CloudWatch alarms can monitor metrics and trigger SNS notifications when thresholds are breached for specified periods.",
        domain: "Monitoring, Logging, and Remediation"
      },
      {
        id: "soa-3",
        question: "An organization wants to prevent any user from deleting S3 buckets in the production account. What is the most effective approach?",
        options: [
          "Use IAM policy to deny s3:DeleteBucket action",
          "Enable MFA Delete on all buckets",
          "Use Service Control Policy (SCP) to deny s3:DeleteBucket",
          "Remove S3 permissions from all users"
        ],
        correctAnswer: 2,
        explanation: "Service Control Policies (SCPs) enforce permissions boundaries across an entire AWS Organization, preventing even root users from performing denied actions.",
        domain: "Security and Compliance"
      },
      {
        id: "soa-4",
        question: "A company needs to automate the patching of 100 EC2 instances monthly. What AWS service should be used?",
        options: [
          "AWS Config",
          "AWS Systems Manager Patch Manager",
          "CloudFormation",
          "AWS Backup"
        ],
        correctAnswer: 1,
        explanation: "Systems Manager Patch Manager automates the process of patching managed instances with security and other updates.",
        domain: "Deployment, Provisioning, and Automation"
      },
      {
        id: "soa-5",
        question: "An application writes logs to CloudWatch Logs. The company wants to retain logs for 7 years to meet compliance requirements. What is the most cost-effective solution?",
        options: [
          "Keep logs in CloudWatch Logs with 7-year retention",
          "Export logs to S3 and use S3 Glacier Deep Archive",
          "Stream logs to Kinesis Data Firehose",
          "Store logs in RDS database"
        ],
        correctAnswer: 1,
        explanation: "Exporting logs to S3 and using Glacier Deep Archive provides the most cost-effective long-term storage for compliance requirements.",
        domain: "Cost and Performance Optimization"
      }
    ]
  }
];
