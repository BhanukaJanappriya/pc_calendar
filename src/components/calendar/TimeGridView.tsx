import React from 'react';
import { 
  format, 
  startOfDay, 
  addHours, 
  eachHourOfInterval, 
  isSameDay,
  parseISO,
  differenceInMinutes,
  startOfHour
} from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TimeGridViewProps {
  days: Date[];
  events: any[];
  onTimeSlotClick: (date: Date) => void;
  onEventClick: (event: any, e: React.MouseEvent) => void;
}

const TimeGridView: React.FC<TimeGridViewProps> = ({ days, events, onTimeSlotClick, onEventClick }) => {
  const hours = eachHourOfInterval({
    start: startOfDay(new Date()),
    end: addHours(startOfDay(new Date()), 23),
  });

  const getEventsForDay = (day: Date) => {
    return events.filter(event => !event.allDay && isSameDay(parseISO(event.startDate || event.date), day));
  };

  const calculateEventStyle = (event: any) => {
    const start = parseISO(event.startDate || event.date);
    const end = parseISO(event.endDate || event.startDate || event.date);
    const startMinutes = differenceInMinutes(start, startOfDay(start));
    const duration = differenceInMinutes(end, start);
    
    return {
      top: `${(startMinutes / 60) * 52}px`, // 52px is height of one hour row
      height: `${(Math.max(duration, 30) / 60) * 52}px`,
      backgroundColor: event.color || '#039be5',
    };
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Grid Header */}
      <div className="flex border-b border-google-border pr-[17px]"> {/* pr-17 for scrollbar alignment */}
        <div className="w-16 flex-shrink-0" />
        <div className={cn("grid flex-1", days.length === 1 ? "grid-cols-1" : "grid-cols-7")}>
          {days.map((day) => (
            <div key={day.toString()} className="py-2 flex flex-col items-center border-l border-google-border">
              <span className="text-[11px] font-medium text-google-light-gray uppercase">
                {format(day, 'EEE')}
              </span>
              <span className={cn(
                "text-2xl font-normal w-12 h-12 flex items-center justify-center rounded-full mt-1",
                isSameDay(day, new Date()) ? "bg-google-blue text-white" : "text-google-gray"
              )}>
                {format(day, 'd')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scrollable Area */}
      <div className="flex-1 overflow-y-auto relative no-scrollbar">
        <div className="flex">
          {/* Hour Labels */}
          <div className="w-16 flex-shrink-0 flex flex-col">
            {hours.map((hour, i) => (
              <div key={i} className="h-[52px] text-right pr-2 -mt-2 text-[10px] text-google-light-gray uppercase">
                {i === 0 ? '' : format(hour, 'h a')}
              </div>
            ))}
          </div>

          {/* Grid Columns */}
          <div className={cn("grid flex-1 relative", days.length === 1 ? "grid-cols-1" : "grid-cols-7")}>
            {days.map((day) => (
              <div 
                key={day.toString()} 
                className="relative border-l border-google-border min-h-full"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const y = e.clientY - rect.top;
                  const totalMinutes = (y / 52) * 60;
                  const clickedDate = startOfDay(day);
                  const finalDate = addHours(clickedDate, totalMinutes / 60);
                  onTimeSlotClick(finalDate);
                }}
              >
                {/* Horizontal Lines */}
                {hours.map((_, i) => (
                  <div key={i} className="h-[52px] border-b border-google-border w-full" />
                ))}

                {/* Events */}
                {getEventsForDay(day).map((event) => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event, e);
                    }}
                    style={calculateEventStyle(event)}
                    className="absolute left-1 right-2 rounded-[4px] px-2 py-1 text-white text-[11px] font-medium shadow-sm hover:brightness-90 transition-all cursor-pointer overflow-hidden z-10"
                  >
                    <div className="truncate">{event.title}</div>
                    <div className="text-[9px] opacity-90">
                      {format(parseISO(event.startDate || event.date), 'h:mm a')}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeGridView;