export interface TimeSlot {
  id: string;
  start: string;
  end: string;
  error?: string;
}

export interface DaySchedule {
  id: string; // 'sunday', 'monday', etc.
  label: string;
  isEnabled: boolean;
  slots: TimeSlot[];
}

export type Days =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";
