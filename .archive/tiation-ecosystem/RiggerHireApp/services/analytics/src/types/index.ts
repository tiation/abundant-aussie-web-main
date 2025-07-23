import { z } from 'zod';

// Analytics event types specific to construction industry
export enum AnalyticsEventType {
  // Safety Events
  SAFETY_INCIDENT = 'SAFETY_INCIDENT',
  NEAR_MISS = 'NEAR_MISS',
  SAFETY_INSPECTION = 'SAFETY_INSPECTION',
  
  // Compliance Events
  LICENSE_VERIFICATION = 'LICENSE_VERIFICATION',
  DOCUMENT_VALIDATION = 'DOCUMENT_VALIDATION',
  COMPLIANCE_CHECK = 'COMPLIANCE_CHECK',
  
  // Job Events
  JOB_POSTED = 'JOB_POSTED',
  JOB_FILLED = 'JOB_FILLED',
  JOB_COMPLETED = 'JOB_COMPLETED',
  
  // User Events
  USER_REGISTRATION = 'USER_REGISTRATION',
  PROFILE_UPDATE = 'PROFILE_UPDATE',
  LICENSE_EXPIRY = 'LICENSE_EXPIRY'
}

// Severity levels for safety incidents
export enum SafetySeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

// Analytics event schema
export const AnalyticsEventSchema = z.object({
  id: z.string().uuid(),
  type: z.nativeEnum(AnalyticsEventType),
  timestamp: z.date(),
  userId: z.string().uuid().optional(),
  companyId: z.string().uuid().optional(),
  metadata: z.record(z.string(), z.unknown()),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
    region: z.string()
  }).optional()
});

export type AnalyticsEvent = z.infer<typeof AnalyticsEventSchema>;

// Safety incident schema
export const SafetyIncidentSchema = z.object({
  id: z.string().uuid(),
  severity: z.nativeEnum(SafetySeverity),
  incidentType: z.string(),
  description: z.string(),
  location: z.string(),
  date: z.date(),
  reportedBy: z.string().uuid(),
  witnesses: z.array(z.string().uuid()),
  immediateActions: z.string(),
  preventiveMeasures: z.string(),
  status: z.enum(['REPORTED', 'INVESTIGATING', 'RESOLVED', 'CLOSED']),
  attachments: z.array(z.string().url()).optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type SafetyIncident = z.infer<typeof SafetyIncidentSchema>;

// Compliance report schema
export const ComplianceReportSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
  reportingPeriod: z.object({
    start: z.date(),
    end: z.date()
  }),
  metrics: z.object({
    totalEmployees: z.number(),
    validLicenses: z.number(),
    expiringLicenses: z.number(),
    safetyIncidents: z.number(),
    nearMisses: z.number(),
    complianceScore: z.number()
  }),
  recommendations: z.array(z.string()),
  generatedAt: z.date()
});

export type ComplianceReport = z.infer<typeof ComplianceReportSchema>;

// Analytics query parameters
export interface AnalyticsQueryParams {
  startDate: Date;
  endDate: Date;
  eventTypes?: AnalyticsEventType[];
  userId?: string;
  companyId?: string;
  region?: string;
  aggregation?: 'hour' | 'day' | 'week' | 'month';
  metrics?: string[];
}

// Analytics result types
export interface TimeSeriesData {
  timestamp: Date;
  value: number;
  metric: string;
}

export interface AggregateMetrics {
  total: number;
  average: number;
  min: number;
  max: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface SafetyMetrics {
  incidentRate: number;
  severityDistribution: Record<SafetySeverity, number>;
  mostCommonTypes: Array<{ type: string; count: number }>;
  trendline: TimeSeriesData[];
}
