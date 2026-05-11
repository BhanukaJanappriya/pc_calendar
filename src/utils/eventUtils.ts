import { 
  isSameDay, 
  parseISO, 
  addDays, 
  addWeeks, 
  addMonths, 
  isBefore, 
  startOfDay, 
  endOfDay,
  eachDayOfInterval
} from 'date-fns';

export const getExpandedEvents = (events: any[], viewStart: Date, viewEnd: Date) => {
  const expanded: any[] = [];
  const rangeStart = startOfDay(viewStart);
  const rangeEnd = endOfDay(viewEnd);

  events.forEach(event => {
    const eventStart = parseISO(event.startDate || event.date);
    
    // If it's not recurring, just check if it's in range
    if (!event.recurrence || event.recurrence === 'none') {
      if (isSameDay(eventStart, rangeStart) || (eventStart >= rangeStart && eventStart <= rangeEnd)) {
        expanded.push(event);
      }
      return;
    }

    // Handle recurring events
    let current = eventStart;
    const limit = rangeEnd;

    // Expansion logic (basic)
    while (isBefore(current, limit) || isSameDay(current, limit)) {
      if (isSameDay(current, rangeStart) || (current >= rangeStart && current <= rangeEnd)) {
        expanded.push({
          ...event,
          id: `${event.id}-${current.getTime()}`,
          startDate: current.toISOString(),
          date: current.toISOString(), // ensure compatibility with MonthView
        });
      }

      if (event.recurrence === 'daily') current = addDays(current, 1);
      else if (event.recurrence === 'weekly') current = addWeeks(current, 1);
      else if (event.recurrence === 'monthly') current = addMonths(current, 1);
      else break;

      // Safety break for very old events
      if (expanded.length > 1000) break; 
    }
  });

  return expanded;
};
