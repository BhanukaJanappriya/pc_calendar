import React from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday,
  isSameDay,
  parseISO
} from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MonthViewProps {
  currentDate: Date;
  events: any[];
  onDayClick: (date: Date) => void;
  onEventClick?: (event: any, e: React.MouseEvent) => void;
}

const MonthView: React.FC<MonthViewProps> = ({ currentDate, events, onDayClick, onEventClick }) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(parseISO(event.date), day));
  };

  return (
    <div className="flex flex-col h-full border-t border-google-border">
      {/* Week Day Labels */}
      <div className="grid grid-cols-7 border-b border-google-border">
        {weekDays.map((day) => (
          <div key={day} className="py-2 text-center text-[11px] font-medium text-google-light-gray">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 flex-1">
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isCurrentDay = isToday(day);
          const dayEvents = getEventsForDay(day);

          return (
            <div 
              key={day.toString()} 
              onClick={() => onDayClick(day)}
              className={cn(
                "border-r border-b border-google-border p-1 min-h-[120px] transition-colors hover:bg-gray-50 cursor-pointer overflow-hidden",
                !isCurrentMonth && "bg-gray-50/50"
              )}
            >
              <div className="flex flex-col items-center h-full">
                <span className={cn(
                  "text-xs font-medium w-7 h-7 flex items-center justify-center rounded-full mt-1 mb-1",
                  isCurrentDay ? "bg-google-blue text-white" : "text-google-gray",
                  !isCurrentMonth && "text-google-light-gray"
                )}>
                  {format(day, 'd') === '1' ? format(day, 'MMM d') : format(day, 'd')}
                </span>
                
                <div className="w-full space-y-1 mt-1 overflow-y-auto max-h-[80px] no-scrollbar">
                  {dayEvents.map((event, i) => (
                    <div 
                      key={event.id || i} 
                      onClick={(e) => {
                        if (onEventClick) {
                          e.stopPropagation();
                          onEventClick(event, e);
                        }
                      }}
                      className="bg-google-blue text-white px-2 py-0.5 rounded-[4px] mx-1 shadow-sm hover:bg-blue-600 transition-colors"
                    >
                      <span className="text-[10px] font-medium truncate block leading-tight">
                        {event.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;
