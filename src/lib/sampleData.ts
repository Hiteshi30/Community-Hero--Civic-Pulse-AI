import { doc, getDocs, collection, writeBatch, query, limit } from 'firebase/firestore';
import { db } from './firebase';
import { Complaint, Department, Reward } from '../types';

export const SAMPLE_DEPARTMENTS: Department[] = [
  {
    id: 'dept_sanitation',
    name: 'Sanitation & Waste Management',
    code: 'SWM',
    headName: 'Dr. Suresh Mishra, IAS',
    officerCount: 42,
    resolvedCount: 384,
    activeCount: 29,
    icon: 'Trash2',
  },
  {
    id: 'dept_water',
    name: 'Water Supply & Sewage',
    code: 'WSS',
    headName: 'Smt. Priya Srinivasan',
    officerCount: 28,
    resolvedCount: 215,
    activeCount: 18,
    icon: 'Droplet',
  },
  {
    id: 'dept_roads',
    name: 'Roads & Infrastructure',
    code: 'RNI',
    headName: 'Shri Amit Deshmukh',
    officerCount: 35,
    resolvedCount: 412,
    activeCount: 34,
    icon: 'Construction',
  },
  {
    id: 'dept_electricity',
    name: 'Electricity & Street Lighting',
    code: 'ESL',
    headName: 'Shri Ramesh Kumar',
    officerCount: 22,
    resolvedCount: 189,
    activeCount: 12,
    icon: 'Zap',
  },
  {
    id: 'dept_health',
    name: 'Public Health & Pollution Control',
    code: 'PHC',
    headName: 'Dr. Anita Roy',
    officerCount: 19,
    resolvedCount: 143,
    activeCount: 8,
    icon: 'Activity',
  },
  {
    id: 'dept_safety',
    name: 'Public Safety & Civic Order',
    code: 'PSC',
    headName: 'Shri Vikram Rathore, IPS',
    officerCount: 25,
    resolvedCount: 97,
    activeCount: 5,
    icon: 'ShieldAlert',
  },
];

export const SAMPLE_REWARDS: Reward[] = [
  {
    id: 'reward_metro_pass',
    title: 'Free Metro Commute Voucher',
    description: 'Get a free ₹100 recharge on your metro smart card (DMRC, BMRCL, MMMOCL).',
    costPoints: 200,
    partnerName: 'Urban Transit Authority',
    category: 'transit',
    couponCode: 'METRO100PASS',
    imageUrl: 'https://images.unsplash.com/photo-1541417904950-b855846fe074?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'reward_solar_rebate',
    title: 'Solar Panel Maintenance Rebate',
    description: '15% discount on professional solar panel cleaning and safety verification.',
    costPoints: 500,
    partnerName: 'Tata Power Solar',
    category: 'utility',
    couponCode: 'SOLARSAFE15',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'reward_eco_bag',
    title: 'Organic Cotton Shopping Bag Set',
    description: 'Receive a set of 3 durable, biodegradable shopping bags delivered to your home.',
    costPoints: 100,
    partnerName: 'EcoEarth India',
    category: 'community',
    couponCode: 'BAGSETFREE',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'reward_coffee_cup',
    title: 'Reusable Bamboo Coffee Mug',
    description: 'Redeem a free sustainable travel mug at any Blue Tokai Coffee outlet.',
    costPoints: 150,
    partnerName: 'Blue Tokai Coffee Roasters',
    category: 'store',
    couponCode: 'BLUETOKAIECO',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'reward_seed_kit',
    title: 'Urban Organic Gardening Seed Kit',
    description: 'Complete home planting kit with organic seeds (tomato, basil, coriander, spinach) & coco peat block.',
    costPoints: 120,
    partnerName: 'TrustBasket',
    category: 'community',
    couponCode: 'GARDENSEEDSKIT',
    imageUrl: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=600&q=80',
  },
];

export const SAMPLE_COMPLAINTS: Complaint[] = [
  {
    id: 'complaint_delhi_1',
    title: 'Hazardous Overflowing Sewage and Water Leakage',
    description: 'Severe sewage water backup near Block E, Connaught Place. The dirty water is flooding the walkway and creating a terrible stench, raising immediate sanitation and mosquito breeding concerns.',
    city: 'Delhi',
    address: 'E-Block Inner Circle, Connaught Place, New Delhi, Delhi 110001',
    latitude: 28.6304,
    longitude: 77.2177,
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80'],
    videos: [],
    reporterId: 'citizen_rajesh',
    reporterName: 'Rajesh Kumar',
    assignedOfficerId: 'officer_priya',
    assignedOfficerName: 'Priya Srinivasan',
    department: 'Water Supply & Sewage',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    severity: 'HIGH',
    verificationCount: 14,
    upvoters: ['citizen_ananya', 'citizen_vivek', 'citizen_priya'],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    aiAnalysis: {
      category: 'Sewage overflow',
      urgencyScore: 85,
      summary: 'Raw sewage water leaking onto public pedestrian corridor in CP. High infection risk, business disruption, and aesthetic damage.',
      detectedSentiment: 'Frustrated / Urgent',
      recommendedDepartment: 'Water Supply & Sewage',
      recommendedAction: 'Dispatch jetting machine immediately and seal pipe breach.',
      duplicateChecked: true,
      isDuplicate: false,
      confidenceScore: 94,
    },
    timeline: [
      {
        status: 'SUBMITTED',
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        note: 'Complaint filed by Rajesh Kumar with image proof.',
        updatedBy: 'System',
      },
      {
        status: 'VERIFIED',
        timestamp: new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000).toISOString(),
        note: 'AI categorization completed. Issue verified by 10 neighboring citizens.',
        updatedBy: 'AI Agent CivicPulse',
      },
      {
        status: 'ASSIGNED',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        note: 'Assigned to Ward Officer Priya Srinivasan for immediate resolution.',
        updatedBy: 'Admin Dispatcher',
      },
      {
        status: 'IN_PROGRESS',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        note: 'Sanitation staff arrived on site. Blockage identified; pipe extraction in progress.',
        updatedBy: 'Priya Srinivasan',
      },
    ],
  },
  {
    id: 'complaint_mumbai_1',
    title: 'Huge Pothole Swarm on Western Express Highway',
    description: 'A cluster of deep, dangerous potholes has formed on the flyover lane of the Western Express Highway near Bandra West. Cars are braking suddenly to avoid them, creating bumper-to-bumper traffic and high risk of accidents.',
    city: 'Mumbai',
    address: 'Bandra Flyover, Western Express Hwy, Bandra West, Mumbai, Maharashtra 400050',
    latitude: 19.0544,
    longitude: 72.8402,
    images: ['https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80'],
    videos: [],
    reporterId: 'citizen_amit',
    reporterName: 'Amit Patel',
    assignedOfficerId: 'officer_deshmukh',
    assignedOfficerName: 'Amit Deshmukh',
    department: 'Roads & Infrastructure',
    status: 'SUBMITTED',
    priority: 'CRITICAL',
    severity: 'CRITICAL',
    verificationCount: 32,
    upvoters: ['citizen_rajesh', 'citizen_ananya', 'citizen_vivek'],
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    aiAnalysis: {
      category: 'Pothole & Road damage',
      urgencyScore: 95,
      summary: 'Multiple deep potholes on a primary, high-speed arterial flyover. Extremely high risk of lethal motor accidents and major economic delays.',
      detectedSentiment: 'Alarmed / Concerned',
      recommendedDepartment: 'Roads & Infrastructure',
      recommendedAction: 'Apply quick-setting cold-mix asphalt patch within 12 hours.',
      duplicateChecked: true,
      isDuplicate: false,
      confidenceScore: 98,
    },
    timeline: [
      {
        status: 'SUBMITTED',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        note: 'Complaint submitted with high-resolution image. GPS coordinates verified.',
        updatedBy: 'System',
      },
    ],
  },
  {
    id: 'complaint_bengaluru_1',
    title: 'Illegal Commercial Garbage Dumping',
    description: 'Several large sacks of waste, plastic containers, and rotten organic kitchen garbage have been dumped in the open corner plot in Indiranagar, right next to the neighborhood park. Street dogs are scattering it everywhere.',
    city: 'Bengaluru',
    address: '12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560008',
    latitude: 12.9719,
    longitude: 77.6412,
    images: ['https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80'],
    videos: [],
    reporterId: 'citizen_ananya',
    reporterName: 'Ananya Rao',
    assignedOfficerId: 'officer_mishra',
    assignedOfficerName: 'Dr. Suresh Mishra, IAS',
    department: 'Sanitation & Waste Management',
    status: 'RESOLVED',
    priority: 'MEDIUM',
    severity: 'MEDIUM',
    verificationCount: 8,
    upvoters: [],
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    aiAnalysis: {
      category: 'Garbage accumulation',
      urgencyScore: 60,
      summary: 'Commercial eatery wastes dumped at non-designated vacant public corner lot. Promotes vector disease and bad smell.',
      detectedSentiment: 'Annoyed',
      recommendedDepartment: 'Sanitation & Waste Management',
      recommendedAction: 'Deploy waste lifter dumper truck, spray sanitizing bleach, and place "No Littering" caution signage.',
      duplicateChecked: true,
      isDuplicate: false,
      confidenceScore: 91,
    },
    timeline: [
      {
        status: 'SUBMITTED',
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        note: 'Complaint registered by Ananya Rao.',
        updatedBy: 'System',
      },
      {
        status: 'VERIFIED',
        timestamp: new Date(Date.now() - 5.5 * 24 * 60 * 60 * 1000).toISOString(),
        note: 'Upvoted and confirmed by 8 community members.',
        updatedBy: 'AI Agent CivicPulse',
      },
      {
        status: 'ASSIGNED',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        note: 'Assigned to BBMP Ward Sanitation Officer.',
        updatedBy: 'System',
      },
      {
        status: 'IN_PROGRESS',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        note: 'BBMP garbage loader truck cleared the pile. Bleach powder spread.',
        updatedBy: 'Sanitation Team',
      },
      {
        status: 'RESOLVED',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        note: 'Resolved. Photo uploaded showing neat clean corner. Citizen reward points issued.',
        updatedBy: 'Dr. Suresh Mishra, IAS',
      },
    ],
  },
  {
    id: 'complaint_chennai_1',
    title: 'Non-Functional Street Lights - Poor Visibility',
    description: 'An entire row of 5 consecutive street lights on 3rd Avenue, T. Nagar has been dead for the last 3 nights. The street is completely dark, causing serious safety issues for female pedestrians, children, and vehicle riders alike.',
    city: 'Chennai',
    address: '3rd Avenue, T. Nagar, Chennai, Tamil Nadu 600017',
    latitude: 13.0405,
    longitude: 80.2337,
    images: ['https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80'],
    videos: [],
    reporterId: 'citizen_vivek',
    reporterName: 'Vivek Singh',
    assignedOfficerId: 'officer_ramesh',
    assignedOfficerName: 'Shri Ramesh Kumar',
    department: 'Electricity & Street Lighting',
    status: 'ASSIGNED',
    priority: 'HIGH',
    severity: 'MEDIUM',
    verificationCount: 19,
    upvoters: ['citizen_amit', 'citizen_ananya'],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
    aiAnalysis: {
      category: 'Street light failure',
      urgencyScore: 78,
      summary: 'Multiple consecutive dead streetlights on busy shopping-residential district street. Heightens crime opportunity, slip-trip injuries, and road collisions.',
      detectedSentiment: 'Worried',
      recommendedDepartment: 'Electricity & Street Lighting',
      recommendedAction: 'Replace LED bulbs/chokes on light pole numbers L-34, L-35, L-36, L-37.',
      duplicateChecked: true,
      isDuplicate: false,
      confidenceScore: 95,
    },
    timeline: [
      {
        status: 'SUBMITTED',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        note: 'Issue reported.',
        updatedBy: 'System',
      },
      {
        status: 'VERIFIED',
        timestamp: new Date(Date.now() - 1.8 * 24 * 60 * 60 * 1000).toISOString(),
        note: 'Validated by community crowdsource checks.',
        updatedBy: 'AI Agent CivicPulse',
      },
      {
        status: 'ASSIGNED',
        timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
        note: 'Assigned to Electrical Maintenance inspector Ramesh Kumar.',
        updatedBy: 'System Dispatcher',
      },
    ],
  },
  {
    id: 'complaint_jaipur_1',
    title: 'Cracked and Damaged Heritage Wall',
    description: 'A portion of the old masonry wall near Hawa Mahal has developed major deep structural cracks. Plaster is falling down on passersby below. Immediate masonry reinforcement is required to protect the heritage site and human life.',
    city: 'Jaipur',
    address: 'Hawa Mahal Rd, Badi Choupad, J.D.A. Market, Pink City, Jaipur, Rajasthan 302002',
    latitude: 26.9239,
    longitude: 75.8267,
    images: ['https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80'],
    videos: [],
    reporterId: 'citizen_amit',
    reporterName: 'Amit Patel',
    assignedOfficerId: 'officer_deshmukh',
    assignedOfficerName: 'Amit Deshmukh',
    department: 'Roads & Infrastructure',
    status: 'VERIFIED',
    priority: 'HIGH',
    severity: 'HIGH',
    verificationCount: 6,
    upvoters: ['citizen_rajesh'],
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    aiAnalysis: {
      category: 'Infrastructure damage',
      urgencyScore: 82,
      summary: 'Deep tectonic/masonry cracking in heritage corridor structure. Fall debris risks tourist head injury and cultural heritage loss.',
      detectedSentiment: 'Alarmed',
      recommendedDepartment: 'Roads & Infrastructure',
      recommendedAction: 'Erect temporary support scaffold, barricade walkways, and contact ASI/Municipality heritage cell.',
      duplicateChecked: true,
      isDuplicate: false,
      confidenceScore: 92,
    },
    timeline: [
      {
        status: 'SUBMITTED',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        note: 'Reported with exact location snapshot.',
        updatedBy: 'System',
      },
      {
        status: 'VERIFIED',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        note: 'AI classified category. High structural urgency flagged.',
        updatedBy: 'AI Agent CivicPulse',
      },
    ],
  }
];

export async function seedDatabaseIfNeeded() {
  try {
    const q = query(collection(db, 'departments'), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('Database seems empty. Seeding realistic sample data...');
      const batch = writeBatch(db);

      // Seed Departments
      SAMPLE_DEPARTMENTS.forEach((dept) => {
        const deptRef = doc(db, 'departments', dept.id);
        batch.set(deptRef, dept);
      });

      // Seed Rewards
      SAMPLE_REWARDS.forEach((rew) => {
        const rewRef = doc(db, 'rewards', rew.id);
        batch.set(rewRef, rew);
      });

      // Seed Complaints
      SAMPLE_COMPLAINTS.forEach((comp) => {
        const compRef = doc(db, 'complaints', comp.id);
        batch.set(compRef, comp);
      });

      await batch.commit();
      console.log('Seeding successful! Database contains departments, rewards, and sample civic complaints from Indian cities.');
    } else {
      console.log('Database already has content. Skipping seeder.');
    }
  } catch (error) {
    console.warn('Error auto-seeding sample database (bypassed for local/offline):', error);
  }
}
