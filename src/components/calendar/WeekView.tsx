import React from 'react';
import { startOfWeek, eachDayOfInterval, addDays } from 'date-fns';
import TimeGridView from './TimeGridView';

interface WeekViewProps {
  currentDate: Date;
  events: any[];
  onTimeSlotClick: (date: Date) => void;
  onEventClick: (event: any, e: React.MouseEvent) => void;
}

const WeekView: React.FC<WeekViewProps> = ({ currentDate, events, onTimeSlotClick, onEventClick }) => {
  const startDate = startOfWeek(currentDate);
  const days = eachDayOfInterval({
    start: startDate,
    end: addDays(startDate, 6),
  });

  return (
    <TimeGridView 
      days={days} 
      events={events} 
      onTimeSlotClick={onTimeSlotClick} 
      onEventClick={onEventClick} 
    />
  );
};

export default WeekView;