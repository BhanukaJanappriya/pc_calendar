import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import MonthView from './components/calendar/MonthView';
import EventModal from './components/calendar/EventModal';
import { addMonths, subMonths } from 'date-fns';

const { ipcRenderer } = window.require('electron');

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
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

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setSelectedDate(new Date(event.date));
    setIsModalOpen(true);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      <Header 
        currentDate={currentDate} 
        onNext={nextMonth} 
        onPrev={prevMonth} 
        onToday={goToToday} 
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentDate={currentDate} onDateSelect={setCurrentDate} />
        <main className="flex-1 overflow-y-auto">
          <MonthView 
            currentDate={currentDate} 
            events={events} 
            onDayClick={handleDayClick}
            onEventClick={handleEventClick}
          />
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
