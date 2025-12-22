// Holiday Management System - Type Definitions

// Recurrence pattern types
export type RecurrencePattern =
  | AnnualRecurrence
  | WeeklyRecurrence
  | MonthlyRecurrence;

export interface AnnualRecurrence {
  type: 'annual';
  month: number; // 1-12
  day: number; // 1-31
}

export interface WeeklyRecurrence {
  type: 'weekly';
  day_of_week: number; // 0-6 (Sunday-Saturday)
}

export interface MonthlyRecurrence {
  type: 'monthly';
  day: number; // 1-31
}

// Database row type
export interface Holiday {
  id: string;
  name: string;
  description: string | null;
  notes: string | null;
  start_date: string; // ISO date string (YYYY-MM-DD)
  end_date: string; // ISO date string (YYYY-MM-DD)
  is_recurring: boolean;
  recurrence_pattern: RecurrencePattern | null;
  recurrence_end_date: string | null; // ISO date string (YYYY-MM-DD)
  is_active: boolean;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
  created_by: string | null; // Admin email
}

// Form types for creating/editing holidays
export interface HolidayFormData {
  name: string;
  description?: string;
  notes?: string;
  start_date: string;
  end_date: string;
  is_recurring: boolean;
  recurrence_pattern?: RecurrencePattern;
  recurrence_end_date?: string;
  is_active: boolean;
}

// API response types
export interface HolidayCheckResult {
  is_holiday: boolean;
  holiday_id?: string;
  holiday_name?: string;
  message?: string;
}

// Validation error type
export interface HolidayValidationError {
  field: string;
  message: string;
}
