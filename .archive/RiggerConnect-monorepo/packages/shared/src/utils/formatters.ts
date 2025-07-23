/**
 * Format currency values with proper symbols and commas
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format dates in a human-readable format
 */
export function formatDate(
  date: Date | string,
  format: 'short' | 'medium' | 'long' | 'relative' = 'medium',
  locale: string = 'en-US'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (format === 'relative') {
    return formatRelativeTime(dateObj);
  }

  const options: Intl.DateTimeFormatOptions = {
    short: { month: 'short', day: 'numeric', year: 'numeric' },
    medium: { month: 'long', day: 'numeric', year: 'numeric' },
    long: { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    },
  }[format];

  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * Format relative time (e.g., "2 hours ago", "in 3 days")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(Math.abs(diffInSeconds) / interval.seconds);
    if (count >= 1) {
      const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
      return rtf.format(diffInSeconds > 0 ? -count : count, interval.label as any);
    }
  }

  return 'just now';
}

/**
 * Format file sizes in human-readable format
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

/**
 * Format phone numbers
 */
export function formatPhoneNumber(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phoneNumber;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Format duration in human-readable format
 */
export function formatDuration(durationString: string): string {
  // Handle common duration formats
  const patterns = [
    { regex: /(\d+)\s*h(?:our)?s?\s*(\d+)\s*m(?:in)?(?:ute)?s?/i, format: (h: string, m: string) => `${h}h ${m}m` },
    { regex: /(\d+)\s*h(?:our)?s?/i, format: (h: string) => `${h} hour${parseInt(h) !== 1 ? 's' : ''}` },
    { regex: /(\d+)\s*m(?:in)?(?:ute)?s?/i, format: (m: string) => `${m} minute${parseInt(m) !== 1 ? 's' : ''}` },
    { regex: /(\d+)\s*d(?:ay)?s?/i, format: (d: string) => `${d} day${parseInt(d) !== 1 ? 's' : ''}` },
    { regex: /(\d+)\s*w(?:eek)?s?/i, format: (w: string) => `${w} week${parseInt(w) !== 1 ? 's' : ''}` },
    { regex: /(\d+)\s*mo(?:nth)?s?/i, format: (mo: string) => `${mo} month${parseInt(mo) !== 1 ? 's' : ''}` },
  ];

  for (const pattern of patterns) {
    const match = durationString.match(pattern.regex);
    if (match) {
      return pattern.format(...match.slice(1));
    }
  }

  return durationString;
}

/**
 * Generate initials from a name
 */
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

/**
 * Format rating with stars
 */
export function formatRating(rating: number, maxRating: number = 5): string {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  return '★'.repeat(fullStars) + (hasHalfStar ? '☆' : '') + '☆'.repeat(emptyStars);
}

/**
 * Slugify text for URLs
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Capitalize first letter of each word
 */
export function capitalizeWords(text: string): string {
  return text.replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Calculate profile completeness percentage
 */
export function calculateProfileCompleteness(profile: any): number {
  const requiredFields = [
    'firstName',
    'lastName',
    'email',
    'phone',
    'location',
    'skills',
    'experience',
  ];
  
  const optionalFields = [
    'avatar',
    'portfolio',
    'certifications',
    'hourlyRate',
  ];

  let completedRequired = 0;
  let completedOptional = 0;

  requiredFields.forEach(field => {
    if (profile[field] && (Array.isArray(profile[field]) ? profile[field].length > 0 : true)) {
      completedRequired++;
    }
  });

  optionalFields.forEach(field => {
    if (profile[field] && (Array.isArray(profile[field]) ? profile[field].length > 0 : true)) {
      completedOptional++;
    }
  });

  // Required fields are worth 80%, optional fields 20%
  const requiredPercentage = (completedRequired / requiredFields.length) * 80;
  const optionalPercentage = (completedOptional / optionalFields.length) * 20;

  return Math.round(requiredPercentage + optionalPercentage);
}

/**
 * Generate a random color based on a string (for avatars, etc.)
 */
export function generateColorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
}
