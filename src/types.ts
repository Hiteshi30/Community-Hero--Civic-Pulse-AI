export type UserRole = 'citizen' | 'officer';

export interface AppUser {
  uid: string;
  email: string;
  role: UserRole;
  name: string;
  avatarUrl: string;
  city: string;
  createdAt: string;
  phoneNumber?: string;
  // Citizen specific
  points?: number;
  badge?: string;
  reportedCount?: number;
  // Officer specific
  department?: string;
  officerId?: string;
  assignedIssuesCount?: number;
}

export type IssueStatus = 'SUBMITTED' | 'VERIFIED' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
export type IssuePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type IssueSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface AIAnalysis {
  category: string;
  urgencyScore: number; // 0 to 100
  summary: string;
  detectedSentiment: string;
  recommendedDepartment: string;
  recommendedAction: string;
  duplicateChecked: boolean;
  isDuplicate: boolean;
  duplicateComplaintId?: string;
  confidenceScore: number; // percentage
}

export interface TimelineEvent {
  status: IssueStatus;
  timestamp: string;
  note: string;
  updatedBy: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  city: string;
  address: string;
  latitude: number;
  longitude: number;
  images: string[];
  videos: string[];
  reporterId: string;
  reporterName: string;
  assignedOfficerId?: string;
  assignedOfficerName?: string;
  department: string;
  status: IssueStatus;
  priority: IssuePriority;
  severity: IssueSeverity;
  verificationCount: number;
  upvoters: string[]; // List of user IDs who upvoted/verified
  createdAt: string;
  updatedAt: string;
  aiAnalysis?: AIAnalysis;
  aiIntelReport?: AIIntelReport;
  priorityDetails?: PriorityDetails;
  timeline: TimelineEvent[];
}

export interface AIIntelReport {
  detectedIssue: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  publicRisk: string;
  estimatedRepairCost: string;
  estimatedResolutionTime: string;
  confidenceScore: number;
  responsibleDepartment: string;
  environmentalImpact: string;
  estimatedCitizensAffected: number;
  emergencyRecommendation: string;
  professionalTitle: string;
  professionalDescription: string;
  civicAuthenticity?: 'REAL' | 'FAKE' | 'INVALID';
  authenticityAnalysis?: string;
  authenticityConfidenceScore?: number;
  detectedLatitude?: number;
  detectedLongitude?: number;
  detectedAddress?: string;
}

export interface PriorityDetails {
  score: number;
  factors: {
    severity: number;
    communityRisk: number;
    trafficImpact: number;
    schoolNearby: boolean;
    hospitalNearby: boolean;
    complaintFrequency: number;
    weather: string;
  };
  explanation: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  headName: string;
  officerCount: number;
  resolvedCount: number;
  activeCount: number;
  icon: string;
}

export interface Comment {
  id: string;
  complaintId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: UserRole;
  content: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string; // Recipient user ID
  title: string;
  description: string;
  type: 'status_update' | 'upvote' | 'reward' | 'assignment' | 'comment';
  referenceId?: string; // Complaint ID or Reward ID
  read: boolean;
  createdAt: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  costPoints: number;
  partnerName: string;
  category: 'transit' | 'utility' | 'store' | 'community';
  couponCode: string;
  imageUrl: string;
}

export interface UserReward {
  id: string;
  userId: string;
  rewardId: string;
  title: string;
  couponCode: string;
  redeemedAt: string;
}
