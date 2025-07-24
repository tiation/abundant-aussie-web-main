// RiggerShared integration for Capacitor app
import { 
  Logger,
  ValidationUtils,
  StringUtils,
  DateUtils,
  NumberUtils,
  ErrorUtils,
  UserRoles,
  JobStatus,
  ApplicationStatus,
  ErrorCodes,
  NotificationTypes,
  CertificationTypes
} from '@rigger/shared';

// Initialize logger for mobile app
export const mobileLogger = new Logger({
  service: 'riggerconnect-capacitor',
  version: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  platform: 'mobile',
});

// Export shared utilities for use throughout the app
export {
  ValidationUtils,
  StringUtils,
  DateUtils,
  NumberUtils,
  ErrorUtils,
  UserRoles,
  JobStatus,
  ApplicationStatus,
  ErrorCodes,
  NotificationTypes,
  CertificationTypes,
};

// Mobile-specific utility functions using RiggerShared
export class MobileUtils {
  static logger = mobileLogger;

  // Form validation using shared utilities
  static validateJobForm(formData: any) {
    const errors: Record<string, string> = {};

    if (!formData.title || formData.title.length < 3) {
      errors.title = 'Job title must be at least 3 characters';
    }

    if (!formData.description || formData.description.length < 10) {
      errors.description = 'Job description must be at least 10 characters';
    }

    if (!formData.location) {
      errors.location = 'Location is required';
    }

    if (!formData.hourlyRate || formData.hourlyRate < 15) {
      errors.hourlyRate = 'Hourly rate must be at least $15/hour';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  // User profile validation
  static validateUserProfile(profile: any) {
    const errors: Record<string, string> = {};

    if (!profile.firstName || profile.firstName.length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }

    if (!profile.lastName || profile.lastName.length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }

    if (!ValidationUtils.isValidEmail(profile.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (profile.phone && !ValidationUtils.isValidAustralianPhone(profile.phone)) {
      errors.phone = 'Please enter a valid Australian phone number';
    }

    if (profile.abn && !ValidationUtils.isValidABN(profile.abn)) {
      errors.abn = 'Please enter a valid Australian Business Number';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  // Format currency for display
  static formatCurrency(amount: number): string {
    return NumberUtils.formatCurrency(amount, 'AUD');
  }

  // Format dates for Australian locale
  static formatDate(date: Date | string): string {
    return DateUtils.formatAustralianDate(date);
  }

  // Get relative time
  static getRelativeTime(date: Date | string): string {
    return DateUtils.getRelativeTime(date);
  }

  // Create job slug for URLs
  static createJobSlug(title: string): string {
    return StringUtils.toSlug(title);
  }

  // Mask sensitive information
  static maskEmail(email: string): string {
    return StringUtils.maskEmail(email);
  }

  // Handle errors consistently
  static handleError(error: Error, context?: string): void {
    const serializedError = ErrorUtils.serializeError(error);
    this.logger.error(`Error in ${context || 'unknown context'}`, serializedError);
  }

  // Log user actions
  static logUserAction(action: string, userId?: string, extra?: Record<string, any>): void {
    this.logger.info(`User action: ${action}`, {
      type: 'USER_ACTION',
      action,
      userId,
      timestamp: new Date().toISOString(),
      platform: 'mobile',
      ...extra,
    });
  }

  // Log offline events
  static logOfflineEvent(event: string, data?: Record<string, any>): void {
    this.logger.info(`Offline event: ${event}`, {
      type: 'OFFLINE_EVENT',
      event,
      timestamp: new Date().toISOString(),
      ...data,
    });
  }

  // Log device events
  static logDeviceEvent(event: string, data?: Record<string, any>): void {
    this.logger.info(`Device event: ${event}`, {
      type: 'DEVICE_EVENT',
      event,
      timestamp: new Date().toISOString(),
      ...data,
    });
  }

  // Get user role display name
  static getUserRoleDisplayName(role: string): string {
    switch (role) {
      case UserRoles.RIGGER:
        return 'Rigger';
      case UserRoles.EMPLOYER:
        return 'Employer';
      case UserRoles.AGENT:
        return 'Agent';
      case UserRoles.SUPERVISOR:
        return 'Supervisor';
      case UserRoles.ADMIN:
        return 'Administrator';
      default:
        return 'Unknown';
    }
  }

  // Get job status display name
  static getJobStatusDisplayName(status: string): string {
    switch (status) {
      case JobStatus.DRAFT:
        return 'Draft';
      case JobStatus.PUBLISHED:
        return 'Published';
      case JobStatus.PAUSED:
        return 'Paused';
      case JobStatus.CLOSED:
        return 'Closed';
      case JobStatus.FILLED:
        return 'Filled';
      case JobStatus.CANCELLED:
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  }

  // Get application status display name
  static getApplicationStatusDisplayName(status: string): string {
    switch (status) {
      case ApplicationStatus.SUBMITTED:
        return 'Submitted';
      case ApplicationStatus.UNDER_REVIEW:
        return 'Under Review';
      case ApplicationStatus.SHORTLISTED:
        return 'Shortlisted';
      case ApplicationStatus.INTERVIEW_SCHEDULED:
        return 'Interview Scheduled';
      case ApplicationStatus.INTERVIEW_COMPLETED:
        return 'Interview Completed';
      case ApplicationStatus.OFFERED:
        return 'Offered';
      case ApplicationStatus.ACCEPTED:
        return 'Accepted';
      case ApplicationStatus.REJECTED:
        return 'Rejected';
      case ApplicationStatus.WITHDRAWN:
        return 'Withdrawn';
      default:
        return 'Unknown';
    }
  }

  // Get certification display name
  static getCertificationDisplayName(certification: string): string {
    switch (certification) {
      case CertificationTypes.WHITE_CARD:
        return 'White Card';
      case CertificationTypes.WORKING_AT_HEIGHTS:
        return 'Working at Heights';
      case CertificationTypes.CONFINED_SPACES:
        return 'Confined Spaces';
      case CertificationTypes.FIRST_AID:
        return 'First Aid';
      case CertificationTypes.RIGGING_LICENSE:
        return 'Rigging License';
      case CertificationTypes.CRANE_LICENSE:
        return 'Crane License';
      case CertificationTypes.FORKLIFT_LICENSE:
        return 'Forklift License';
      case CertificationTypes.ELECTRICAL_LICENSE:
        return 'Electrical License';
      case CertificationTypes.WELDING_CERTIFICATE:
        return 'Welding Certificate';
      default:
        return certification;
    }
  }
}

// Export default mobile utilities
export default MobileUtils;
