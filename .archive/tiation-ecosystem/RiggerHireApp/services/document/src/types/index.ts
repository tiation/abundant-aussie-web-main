import { z } from 'zod';

// Document types specific to Western Australia construction industry
export enum DocumentType {
  HIGH_RISK_WORK_LICENSE = 'HIGH_RISK_WORK_LICENSE',
  DOGMAN_LICENSE = 'DOGMAN_LICENSE',
  RIGGER_LICENSE = 'RIGGER_LICENSE',
  CRANE_OPERATOR_LICENSE = 'CRANE_OPERATOR_LICENSE',
  WHITE_CARD = 'WHITE_CARD',
  SAFETY_INDUCTION = 'SAFETY_INDUCTION',
  MEDICAL_CERTIFICATE = 'MEDICAL_CERTIFICATE',
  POLICE_CLEARANCE = 'POLICE_CLEARANCE'
}

// License classes as per WorkSafe WA
export enum LicenseClass {
  DG = 'DG', // Dogging
  RB = 'RB', // Basic Rigging
  RI = 'RI', // Intermediate Rigging
  RA = 'RA', // Advanced Rigging
  CN = 'CN', // Non-Slewing Mobile Crane
  C2 = 'C2', // Slewing Mobile Crane (20t)
  C6 = 'C6', // Slewing Mobile Crane (60t)
  C1 = 'C1', // Slewing Mobile Crane (100t)
  CB = 'CB', // Bridge and Gantry Crane
  CT = 'CT'  // Tower Crane
}

// Document schema with Zod validation
export const DocumentSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: z.nativeEnum(DocumentType),
  licenseClass: z.nativeEnum(LicenseClass).optional(),
  documentNumber: z.string(),
  issuedBy: z.string(),
  issuedDate: z.date(),
  expiryDate: z.date(),
  status: z.enum(['PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED']),
  verifiedBy: z.string().uuid().optional(),
  verificationDate: z.date().optional(),
  verificationNotes: z.string().optional(),
  documentUrl: z.string().url(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type Document = z.infer<typeof DocumentSchema>;

// WorkSafe WA verification response
export interface WorkSafeVerification {
  isValid: boolean;
  licenseNumber: string;
  holderName: string;
  licenseClass: LicenseClass;
  expiryDate: Date;
  restrictions?: string[];
  verificationId: string;
}

// Document verification result
export interface VerificationResult {
  success: boolean;
  document: Document;
  worksafeVerification?: WorkSafeVerification;
  errors?: string[];
}

// Document processing status
export interface ProcessingStatus {
  documentId: string;
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  progress: number;
  message?: string;
}
