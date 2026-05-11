export type CalendarViewType = 'day' | 'week' | 'month';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  date: string; // compatibility
  color?: string;
  recurrence?: 'none' | 'daily' | 'weekly' | 'monthly';
  allDay?: boolean;
}
