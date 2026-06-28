// Realistic Indian Municipal Data & AI Agent configurations
import { IssueSeverity, IssuePriority } from '../types';

export interface WardHealth {
  name: string;
  healthScore: number;
  infraScore: number;
  engagementScore: number;
  resolutionScore: number;
  riskScore: number;
  zone: 'green' | 'yellow' | 'orange' | 'red';
  coordinates: string; // CSS clip-path or visual grid coordinates
  recommendations: string[];
}

export interface PredictiveRisk {
  ward: string;
  riskType: string;
  probability: number;
  timeframe: string;
  trigger: string;
  mitigation: string;
}

export interface DuplicateGroup {
  id: string;
  category: string;
  similarity: number;
  primaryIssue: {
    id: string;
    title: string;
    reporter: string;
    gps: string;
    description: string;
  };
  duplicateIssue: {
    id: string;
    title: string;
    reporter: string;
    gps: string;
    description: string;
  };
}

export const WARDS_DATA: WardHealth[] = [
  {
    name: 'Karol Bagh (Ward 4)',
    healthScore: 54,
    infraScore: 48,
    engagementScore: 72,
    resolutionScore: 58,
    riskScore: 78,
    zone: 'orange',
    coordinates: 'polygon(10% 20%, 40% 10%, 45% 45%, 15% 40%)',
    recommendations: [
      'De-silt drains along Pusa Road immediately to prevent waterlogging (-15% flood risk).',
      'Optimize roads-crew allocation by shifting 1 pothole repair crew from Connaught Place.',
      'Implement smart solid waste bins near Block 12'
    ]
  },
  {
    name: 'Chandni Chowk (Ward 1)',
    healthScore: 38,
    infraScore: 30,
    engagementScore: 68,
    resolutionScore: 41,
    riskScore: 92,
    zone: 'red',
    coordinates: 'polygon(45% 10%, 80% 15%, 70% 50%, 45% 45%)',
    recommendations: [
      'Deploy narrow-lane micro compactors to clear piled garbage in Lane B.',
      'Audit dangling electrical cabling and secure water-damaged transformers.',
      'Escalate priority score on community-verified structural sewer fissures.'
    ]
  },
  {
    name: 'Connaught Place (Ward 2)',
    healthScore: 82,
    infraScore: 85,
    engagementScore: 80,
    resolutionScore: 88,
    riskScore: 28,
    zone: 'green',
    coordinates: 'polygon(15% 40%, 45% 45%, 50% 85%, 10% 75%)',
    recommendations: [
      'Maintain weekly preventive inspection logs of subterranean sewer lines.',
      'Promote public awareness for smart rewards platform to boost engagement.',
      'Fine-tune street-light sensor timings for energy conservation.'
    ]
  },
  {
    name: 'Saket District (Ward 8)',
    healthScore: 65,
    infraScore: 60,
    engagementScore: 75,
    resolutionScore: 68,
    riskScore: 52,
    zone: 'yellow',
    coordinates: 'polygon(50% 85%, 45% 45%, 70% 50%, 85% 80%)',
    recommendations: [
      'Repair road potholes near Select Citywalk corridor to mitigate traffic bottlenecks.',
      'Install localized rainwater harvesting wells near Block G public park.',
      'Optimize public feedback surveys to increase satisfaction score.'
    ]
  },
  {
    name: 'Dwarka Sec-6 (Ward 12)',
    healthScore: 71,
    infraScore: 74,
    engagementScore: 69,
    resolutionScore: 73,
    riskScore: 45,
    zone: 'yellow',
    coordinates: 'polygon(70% 50%, 80% 15%, 95% 45%, 85% 80%)',
    recommendations: [
      'Establish community cleanup drive in Sector 6 market plaza to clear waste mounds.',
      'Refit public park lights with low-energy smart LEDs.',
      'Deploy localized air quality monitor adjacent to metro terminal.'
    ]
  }
];

export const PREDICTIVE_RISKS: PredictiveRisk[] = [
  {
    ward: 'Karol Bagh',
    riskType: 'Drainage Pipeline Overload',
    probability: 88,
    timeframe: 'Next 3 Days',
    trigger: 'Heavy rainfall warning (yellow alert) + existing silt accumulation of 64%',
    mitigation: 'Dispatch gully emptier trucks to clean main junction lines immediately.'
  },
  {
    ward: 'Chandni Chowk',
    riskType: 'Power Grid Tripping',
    probability: 78,
    timeframe: 'Next 48 Hours',
    trigger: 'Overhanging lines exposed to high monsoon wind gusts (up to 45 km/h)',
    mitigation: 'Emergency cable tightening and preventive power-load balancing.'
  },
  {
    ward: 'Bandra Flyover (Mumbai)',
    riskType: 'Pothole Swarm Crack Expansion',
    probability: 94,
    timeframe: 'Immediate (24 hours)',
    trigger: 'Heavy vehicular traffic + continuous rainwater seepages into road sub-base',
    mitigation: 'Emergency pre-pave with rapid bituminous patch mix during low-traffic window (2 AM - 5 AM).'
  },
  {
    ward: 'Saket District',
    riskType: 'Sewage Backflow',
    probability: 62,
    timeframe: 'Next 5 Days',
    trigger: 'Subterranean blockages due to construction debris dumping near Sector 3',
    mitigation: 'Send hydro-jetting machines to clear blockages near Block J intersection.'
  }
];

export const DUPLICATE_COMPLAINTS: DuplicateGroup[] = [
  {
    id: 'dup_1',
    category: 'Water Supply & Sewage',
    similarity: 94,
    primaryIssue: {
      id: 'complaint_delhi_1',
      title: 'Hazardous Overflowing Sewage and Water Leakage',
      reporter: 'Rajesh Kumar',
      gps: '28.6304, 77.2177',
      description: 'Severe sewage water backup near Block E, Connaught Place. Walkway is flooded with toxic smelly black water.'
    },
    duplicateIssue: {
      id: 'complaint_delhi_1_dup',
      title: 'Water leaking out of sewer manhole CP Block E',
      reporter: 'Ananya Sharma',
      gps: '28.6305, 77.2179',
      description: 'Walking path near CP E block is completely flooded. Smells like sewage, water is bubbling from a circular metal plate.'
    }
  },
  {
    id: 'dup_2',
    category: 'Roads & Infrastructure',
    similarity: 88,
    primaryIssue: {
      id: 'complaint_mumbai_1',
      title: 'Huge Pothole Swarm on Western Express Highway',
      reporter: 'Amit Patel',
      gps: '19.0544, 72.8402',
      description: 'A cluster of deep, dangerous potholes on the flyover lane of Western Express Highway near Bandra West.'
    },
    duplicateIssue: {
      id: 'complaint_mumbai_1_dup',
      title: 'Dangerous deep potholes Bandra flyover WEH',
      reporter: 'Siddharth Sen',
      gps: '19.0541, 72.8406',
      description: 'Big craters on Western Express Highway flyover (Bandra direction). Cars swerving sharply, major safety risk.'
    }
  }
];

export const SAMPLE_EMERGENCIES = [
  {
    id: 'emerg_1',
    type: 'Gas Leak',
    location: 'Karol Bagh Market Lane 3',
    severity: 'CRITICAL',
    description: 'Underground natural gas pipeline fractured during unauthorized telecom cable excavation. Sub-surface methane levels detected at 3.2% LEL.',
    timestamp: 'Just now',
    dispatchedUnit: 'Rapid Hazard Control Unit (HCU-4)',
    actionRecommended: 'Isolate power lines within 100m, restrict vehicle ignition sources, evacuate Lane 3 vendors.'
  },
  {
    id: 'emerg_2',
    type: 'Road Collapse',
    location: 'Chandni Chowk Main Metro Alleyway',
    severity: 'CRITICAL',
    description: 'Subsurface water leak washed away foundation sand, causing a 3-meter wide sinkhole to cave in.',
    timestamp: '4 mins ago',
    dispatchedUnit: 'Infrastructure Disaster Squad (IDS-12)',
    actionRecommended: 'Erect steel perimeter barricades, suspend heavy loader entry, execute rapid structural ground-grouting.'
  },
  {
    id: 'emerg_3',
    type: 'Major Flooding',
    location: 'Indiranagar Main Drainage Tunnel Block D',
    severity: 'HIGH',
    description: 'Trash blockage inside main storm outflow collapsed primary sluice gates, water level rising 12 inches/hour.',
    timestamp: '12 mins ago',
    dispatchedUnit: 'Drainage Relief Fleet (DRF-2)',
    actionRecommended: 'Deploy high-volume suction trucks (gully emptiers) and establish mechanical bypass.'
  }
];

export const TIMELINE_TEMPLATES = [
  "Vision Agent analysed complaint #{ID}",
  "Priority Agent calculated priority score of {SCORE} for complaint #{ID}",
  "Duplicate Agent flagged #{ID_DUP} as 92% match to #{ID}",
  "Resource Optimizer reassigned 2 officers to Ward 4 backlog",
  "Prediction Agent updated monsoon risk model: Karol Bagh flood probability at 88%",
  "Sentiment analysis flagged 4 angry comments regarding pothole delays in Ward 8",
  "Emergency Response Agent escalated road cave-in #{ID} to CRITICAL priority",
  "Executive Report Agent compiled Daily Ward Status brief",
  "City Health Agent adjusted Connaught Place health index to 82%",
  "Smart Automation auto-escalated delayed complaint #{ID} due to hospital proximity"
];
