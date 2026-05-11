import React from 'react';
import TimeGridView from './TimeGridView';

interface DayViewProps {
  currentDate: Date;
  events: any[];
  onTimeSlotClick: (date: Date) => void;
  onEventClick: (event: any, e: React.MouseEvent) => void;
}

const DayView: React.FC<DayViewProps> = ({ currentDate, events, onTimeSlotClick, onEventClick }) => {
  return (
    <TimeGridView 
      days={[currentDate]} 
      events={events} 
      onTimeSlotClick={onTimeSlotClick} 
      onEventClick={onEventClick} 
    />
  );
};

export default DayView;