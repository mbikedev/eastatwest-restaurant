import { Holiday, RecurrencePattern, HolidayValidationError } from '@/types/holidays';

/**
 * Check if a given date falls within a holiday period
 */
export function isDateInHolidayRange(date: Date, holiday: Holiday): boolean {
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);

  const startDate = new Date(holiday.start_date);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(holiday.end_date);
  endDate.setHours(0, 0, 0, 0);

  // Check non-recurring holidays
  if (!holiday.is_recurring) {
    return checkDate >= startDate && checkDate <= endDate;
  }

  // Check recurring holidays
  if (holiday.recurrence_pattern) {
    // Check if we've passed the recurrence end date
    if (holiday.recurrence_end_date) {
      const recurrenceEndDate = new Date(holiday.recurrence_end_date);
      recurrenceEndDate.setHours(0, 0, 0, 0);
      if (checkDate > recurrenceEndDate) {
        return false;
      }
    }

    const pattern = holiday.recurrence_pattern;

    if (pattern.type === 'annual') {
      // Check if the month and day match
      return (
        checkDate.getMonth() + 1 === pattern.month &&
        checkDate.getDate() === pattern.day
      );
    }

    if (pattern.type === 'weekly') {
      return checkDate.getDay() === pattern.day_of_week;
    }

    if (pattern.type === 'monthly') {
      return checkDate.getDate() === pattern.day;
    }
  }

  return false;
}

/**
 * Format a date range for display
 */
export function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Single day
  if (startDate === endDate) {
    return start.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  // Date range - same year
  if (start.getFullYear() === end.getFullYear()) {
    // Same month
    if (start.getMonth() === end.getMonth()) {
      return `${start.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })} - ${end.toLocaleDateString('en-US', {
        day: 'numeric',
        year: 'numeric',
      })}`;
    }
    // Different months, same year
    return `${start.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })} - ${end.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })}`;
  }

  // Different years
  return `${start.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })} - ${end.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })}`;
}

/**
 * Format recurrence pattern for display
 */
export function formatRecurrencePattern(
  pattern: RecurrencePattern | null
): string {
  if (!pattern) return 'One-time';

  if (pattern.type === 'annual') {
    const date = new Date(2000, pattern.month - 1, pattern.day);
    return `Annually on ${date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
    })}`;
  }

  if (pattern.type === 'weekly') {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return `Every ${days[pattern.day_of_week]}`;
  }

  if (pattern.type === 'monthly') {
    return `Monthly on day ${pattern.day}`;
  }

  return 'Unknown pattern';
}

/**
 * Validate holiday form data
 */
export function validateHolidayForm(data: any): HolidayValidationError[] {
  const errors: HolidayValidationError[] = [];

  // Required fields
  if (!data.name?.trim()) {
    errors.push({ field: 'name', message: 'Holiday name is required' });
  }

  if (!data.start_date) {
    errors.push({ field: 'start_date', message: 'Start date is required' });
  }

  if (!data.end_date) {
    errors.push({ field: 'end_date', message: 'End date is required' });
  }

  // Date range validation
  if (data.start_date && data.end_date) {
    const start = new Date(data.start_date);
    const end = new Date(data.end_date);

    if (end < start) {
      errors.push({
        field: 'end_date',
        message: 'End date must be after or equal to start date',
      });
    }
  }

  // Recurrence validation
  if (data.is_recurring) {
    if (!data.recurrence_pattern) {
      errors.push({
        field: 'recurrence_pattern',
        message: 'Recurrence pattern is required for recurring holidays',
      });
    } else {
      const pattern = data.recurrence_pattern;

      if (pattern.type === 'annual') {
        if (!pattern.month || pattern.month < 1 || pattern.month > 12) {
          errors.push({
            field: 'recurrence_pattern',
            message: 'Invalid month in recurrence pattern (must be 1-12)',
          });
        }
        if (!pattern.day || pattern.day < 1 || pattern.day > 31) {
          errors.push({
            field: 'recurrence_pattern',
            message: 'Invalid day in recurrence pattern (must be 1-31)',
          });
        }
      }

      if (pattern.type === 'weekly') {
        if (
          pattern.day_of_week === undefined ||
          pattern.day_of_week < 0 ||
          pattern.day_of_week > 6
        ) {
          errors.push({
            field: 'recurrence_pattern',
            message: 'Invalid day of week in recurrence pattern (must be 0-6)',
          });
        }
      }

      if (pattern.type === 'monthly') {
        if (!pattern.day || pattern.day < 1 || pattern.day > 31) {
          errors.push({
            field: 'recurrence_pattern',
            message:
              'Invalid day in recurrence pattern for monthly (must be 1-31)',
          });
        }
      }
    }
  }

  return errors;
}

/**
 * Generate occurrences for a recurring holiday within a date range
 */
export function generateRecurringOccurrences(
  holiday: Holiday,
  startDate: Date,
  endDate: Date
): Date[] {
  if (!holiday.is_recurring || !holiday.recurrence_pattern) {
    return [];
  }

  const occurrences: Date[] = [];
  const pattern = holiday.recurrence_pattern;
  const currentDate = new Date(startDate);
  currentDate.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  const recurrenceEnd = holiday.recurrence_end_date
    ? new Date(holiday.recurrence_end_date)
    : end;
  recurrenceEnd.setHours(0, 0, 0, 0);

  if (pattern.type === 'annual') {
    // Generate annual occurrences
    let year = currentDate.getFullYear();
    const lastYear = Math.min(end.getFullYear(), recurrenceEnd.getFullYear());

    while (year <= lastYear) {
      const occurrence = new Date(year, pattern.month - 1, pattern.day);
      occurrence.setHours(0, 0, 0, 0);

      if (
        occurrence >= startDate &&
        occurrence <= end &&
        occurrence <= recurrenceEnd
      ) {
        occurrences.push(new Date(occurrence));
      }
      year++;
    }
  }

  if (pattern.type === 'weekly') {
    // Generate weekly occurrences
    const current = new Date(currentDate);
    while (current <= end && current <= recurrenceEnd) {
      if (current.getDay() === pattern.day_of_week && current >= startDate) {
        occurrences.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }
  }

  if (pattern.type === 'monthly') {
    // Generate monthly occurrences
    const current = new Date(currentDate);
    while (current <= end && current <= recurrenceEnd) {
      if (current.getDate() === pattern.day && current >= startDate) {
        occurrences.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }
  }

  return occurrences;
}

/**
 * Get a user-friendly status badge color
 */
export function getStatusColor(isActive: boolean): string {
  return isActive ? 'bg-green-500' : 'bg-gray-500';
}

/**
 * Get a user-friendly status label
 */
export function getStatusLabel(isActive: boolean): string {
  return isActive ? 'Active' : 'Inactive';
}
