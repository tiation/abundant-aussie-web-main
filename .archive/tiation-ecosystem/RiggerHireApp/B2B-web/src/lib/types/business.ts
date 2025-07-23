// Industry Types
export type IndustryType = 
  | 'mining_operations'
  | 'construction_commercial'
  | 'construction_residential'
  | 'civil_engineering'
  | 'heavy_machinery'
  | 'demolition'
  | 'crane_operations'
  | 'rigging_specialists'
  | 'electrical_contractors'
  | 'engineering_consultancy';

export interface IndustryRequirement {
  name: string;
  licenses: string[];
  insuranceTypes: string[];
  certifications: string[];
  description: string;
}

// WA Industry Requirements Map
export const INDUSTRY_REQUIREMENTS: Record<IndustryType, IndustryRequirement> = {
  mining_operations: {
    name: 'Mining Operations',
    licenses: [
      'Mining Operations License',
      'Environmental Management Permit',
      'WA DMP Registration'
    ],
    insuranceTypes: [
      'Public Liability Insurance ($20M minimum)',
      'Workers Compensation Insurance',
      'Professional Indemnity Insurance',
      'Mining Operation Insurance'
    ],
    certifications: [
      'Mine Site Safety Certification',
      'Environmental Management Certification'
    ],
    description: 'Mining operations in Western Australia including surface and underground mining activities.'
  },
  construction_commercial: {
    name: 'Commercial Construction',
    licenses: [
      'WA Builder Registration',
      'Commercial Builder License',
      'Construction Contractor Registration'
    ],
    insuranceTypes: [
      'Public Liability Insurance ($20M minimum)',
      'Professional Indemnity Insurance',
      'Contract Works Insurance',
      'Workers Compensation Insurance'
    ],
    certifications: [
      'Commercial Building Certification',
      'Safety Management System Certification'
    ],
    description: 'Commercial construction projects including office buildings, retail spaces, and industrial facilities.'
  },
  construction_residential: {
    name: 'Residential Construction',
    licenses: [
      'WA Builder Registration',
      'Residential Builder License'
    ],
    insuranceTypes: [
      'Public Liability Insurance ($10M minimum)',
      'Home Warranty Insurance',
      'Workers Compensation Insurance'
    ],
    certifications: [
      'Residential Building Certification'
    ],
    description: 'Residential construction projects including houses, apartments, and renovations.'
  },
  civil_engineering: {
    name: 'Civil Engineering',
    licenses: [
      'Civil Contractor License',
      'Engineering Contractor Registration'
    ],
    insuranceTypes: [
      'Public Liability Insurance ($20M minimum)',
      'Professional Indemnity Insurance',
      'Contract Works Insurance'
    ],
    certifications: [
      'Civil Engineering Certification',
      'Quality Management System Certification'
    ],
    description: 'Civil engineering projects including roads, bridges, and infrastructure works.'
  },
  heavy_machinery: {
    name: 'Heavy Machinery Operations',
    licenses: [
      'Heavy Machinery Operation License',
      'High Risk Work License'
    ],
    insuranceTypes: [
      'Public Liability Insurance ($10M minimum)',
      'Equipment Insurance',
      'Workers Compensation Insurance'
    ],
    certifications: [
      'Machinery Operation Certification',
      'Safety Management Certification'
    ],
    description: 'Heavy machinery operations including excavators, bulldozers, and earthmoving equipment.'
  },
  demolition: {
    name: 'Demolition Services',
    licenses: [
      'Demolition License',
      'Worksafe WA Registration'
    ],
    insuranceTypes: [
      'Public Liability Insurance ($20M minimum)',
      'Environmental Liability Insurance',
      'Workers Compensation Insurance'
    ],
    certifications: [
      'Demolition Safety Certification',
      'Hazardous Materials Handling Certification'
    ],
    description: 'Demolition services including building demolition and site clearing.'
  },
  crane_operations: {
    name: 'Crane Operations',
    licenses: [
      'High Risk Work License (CN Class)',
      'Crane Operator License'
    ],
    insuranceTypes: [
      'Public Liability Insurance ($20M minimum)',
      'Equipment Insurance',
      'Workers Compensation Insurance'
    ],
    certifications: [
      'Crane Operation Certification',
      'Safety Management System Certification'
    ],
    description: 'Crane operations including mobile cranes, tower cranes, and lifting operations.'
  },
  rigging_specialists: {
    name: 'Rigging Specialists',
    licenses: [
      'High Risk Work License (RB, RI, RA Class)',
      'Rigging License'
    ],
    insuranceTypes: [
      'Public Liability Insurance ($10M minimum)',
      'Professional Indemnity Insurance',
      'Workers Compensation Insurance'
    ],
    certifications: [
      'Advanced Rigging Certification',
      'Height Safety Certification'
    ],
    description: 'Rigging services including construction rigging, industrial rigging, and lift planning.'
  },
  electrical_contractors: {
    name: 'Electrical Contractors',
    licenses: [
      'Electrical Contractor License',
      'Electrical Worker License'
    ],
    insuranceTypes: [
      'Public Liability Insurance ($10M minimum)',
      'Professional Indemnity Insurance',
      'Workers Compensation Insurance'
    ],
    certifications: [
      'Electrical Safety Certification',
      'Energy Safety Certification'
    ],
    description: 'Electrical contracting services including industrial and commercial electrical work.'
  },
  engineering_consultancy: {
    name: 'Engineering Consultancy',
    licenses: [
      'Professional Engineer Registration',
      'Engineering Consultant License'
    ],
    insuranceTypes: [
      'Professional Indemnity Insurance',
      'Public Liability Insurance ($10M minimum)'
    ],
    certifications: [
      'Quality Management System Certification',
      'Professional Engineer Certification'
    ],
    description: 'Engineering consultancy services including design, project management, and technical advice.'
  }
};

// ABN Validation
export const validateABN = (abn: string): boolean => {
  // Remove spaces and check length
  const cleanABN = abn.replace(/\s/g, '');
  if (cleanABN.length !== 11) return false;
  
  // Check if all characters are numbers
  if (!/^\d+$/.test(cleanABN)) return false;
  
  // Weighting factors for ABN validation
  const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  
  // Calculate checksum
  let sum = 0;
  for (let i = 0; i < 11; i++) {
    sum += (parseInt(cleanABN[i]) * weights[i]);
  }
  
  return (sum % 89) === 0;
};

// ACN Validation
export const validateACN = (acn: string): boolean => {
  // Remove spaces and check length
  const cleanACN = acn.replace(/\s/g, '');
  if (cleanACN.length !== 9) return false;
  
  // Check if all characters are numbers
  if (!/^\d+$/.test(cleanACN)) return false;
  
  // Weighting factors for ACN validation
  const weights = [8, 7, 6, 5, 4, 3, 2, 1];
  
  // Calculate checksum
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    sum += (parseInt(cleanACN[i]) * weights[i]);
  }
  
  const remainder = sum % 10;
  const checkDigit = (10 - remainder) % 10;
  
  return checkDigit === parseInt(cleanACN[8]);
};

// File validation
export interface FileRequirements {
  maxSize: number; // in bytes
  allowedTypes: string[];
}

export const LICENSE_FILE_REQUIREMENTS: FileRequirements = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    'application/pdf',
    'image/jpeg',
    'image/png'
  ]
};

export const INSURANCE_FILE_REQUIREMENTS: FileRequirements = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    'application/pdf',
    'image/jpeg',
    'image/png'
  ]
};

export const validateFile = (file: File, requirements: FileRequirements): string | null => {
  if (file.size > requirements.maxSize) {
    return `File size must be less than ${requirements.maxSize / (1024 * 1024)}MB`;
  }
  
  if (!requirements.allowedTypes.includes(file.type)) {
    return `File type must be one of: ${requirements.allowedTypes.join(', ')}`;
  }
  
  return null;
};
