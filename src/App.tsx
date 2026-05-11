import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import MonthView from './components/calendar/MonthView';
import DayView from './components/calendar/DayView';
import WeekView from './components/calendar/WeekView';
import EventModal from './components/calendar/EventModal';
import { addMonths, subMonths, addDays, subDays } from 'date-fns';

const { ipcRenderer } = window.require('electron');

export type CalendarViewType = 'day' | 'week' | 'month';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarViewType>('month');
  const [events, setEvents] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const loadedEvents = await ipcRenderer.invoke('get-events');
    setEvents(loadedEvents);
  };

  const handleSaveEvent = async (newEvent: any) => {
    const updatedEvents = await ipcRenderer.invoke('save-event', newEvent);
    setEvents(updatedEvents);
  };

  const handleUpdateEvent = async (updatedEvent: any) => {
    const updatedEvents = await ipcRenderer.invoke('update-event', updatedEvent);
    setEvents(updatedEvents);
  };

  const handleDeleteEvent = async (id: string) => {
    const updatedEvents = await ipcRenderer.invoke('delete-event', id);
    setEvents(updatedEvents);
  };

  const nextDate = () => {
    if (view === 'month') setCurrentDate(addMonths(currentDate, 1));
    else if (view === 'week') setCurrentDate(addDays(currentDate, 7));
    else setCurrentDate(addDays(currentDate, 1));
  };

  const prevDate = () => {
    if (view === 'month') setCurrentDate(subMonths(currentDate, 1));
    else if (view === 'week') setCurrentDate(subDays(currentDate, 7));
    else setCurrentDate(subDays(currentDate, 1));
  };

  const goToToday = () => setCurrentDate(new Date());

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleTimeSlotClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setSelectedDate(new Date(event.startDate || event.date));
    setIsModalOpen(true);
  };

  const renderView = () => {
    switch (view) {
      case 'month':
        return (
          <MonthView 
            currentDate={currentDate} 
            events={visibleEvents} 
            onDayClick={handleDayClick}
            onEventClick={handleEventClick}
          />
        );
      case 'week':
        return (
          <WeekView 
            currentDate={currentDate} 
            events={visibleEvents} 
            onTimeSlotClick={handleTimeSlotClick}
            onEventClick={handleEventClick}
          />
        );
      case 'day':
        return (
          <DayView 
            currentDate={currentDate} 
            events={visibleEvents} 
            onTimeSlotClick={handleTimeSlotClick}
            onEventClick={handleEventClick}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      <Header 
        currentDate={currentDate} 
        onNext={nextDate} 
        onPrev={prevDate} 
        onToday={goToToday} 
        view={view}
        onViewChange={setView}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentDate={currentDate} onDateSelect={setCurrentDate} />
        <main className="flex-1 overflow-y-auto">
          {renderView()}
        </main>
      </div>

      <EventModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
        onSave={handleSaveEvent}
        existingEvent={selectedEvent}
        onDelete={handleDeleteEvent}
        onUpdate={handleUpdateEvent}
      />
    </div>
  );
};

export default App;  <div className="flex flex-1 overflow-hidden">
        <Sidebar currentDate={currentDate} onDateSelect={setCurrentDate} />
        <main className="flex-1 overflow-y-auto">
          {renderView()}
        </main>
      </div>

      <EventModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={selectedDate}
        onSave={handleSaveEvent}
        existingEvent={selectedEvent}
        onDelete={handleDeleteEvent}
        onUpdate={handleUpdateEvent}
      />
    </div>
  );
};

export default App;