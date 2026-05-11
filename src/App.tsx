import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import MonthView from './components/calendar/MonthView';
import DayView from './components/calendar/DayView';
import WeekView from './components/calendar/WeekView';
import EventModal from './components/calendar/EventModal';
import { addMonths, subMonths, addDays, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { getExpandedEvents } from './utils/eventUtils';
import { CalendarViewType } from './types/calendar';

// Standard Electron IPC check
const electron = (window as any).require ? (window as any).require('electron') : null;
const ipcRenderer = electron ? electron.ipcRenderer : null;

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarViewType>('month');
  const [events, setEvents] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    if (!ipcRenderer) {
      console.warn("Running in web mode or Electron not ready");
      setIsLoaded(true);
      return;
    }
    try {
      const loadedEvents = await ipcRenderer.invoke('get-events');
      setEvents(Array.isArray(loadedEvents) ? loadedEvents : []);
    } catch (err) {
      console.error("IPC Error:", err);
    } finally {
      setIsLoaded(true);
    }
  };

  const visibleEvents = (() => {
    try {
      let start, end;
      if (view === 'month') {
        start = startOfWeek(startOfMonth(currentDate));
        end = endOfWeek(endOfMonth(currentDate));
      } else if (view === 'week') {
        start = startOfWeek(currentDate);
        end = endOfWeek(currentDate);
      } else {
        start = currentDate;
        end = currentDate;
      }
      return getExpandedEvents(events, start, end);
    } catch (e) {
      return [];
    }
  })();

  const handleSaveEvent = async (newEvent: any) => {
    if (!ipcRenderer) return;
    const updatedEvents = await ipcRenderer.invoke('save-event', newEvent);
    setEvents(updatedEvents);
  };

  const handleUpdateEvent = async (updatedEvent: any) => {
    if (!ipcRenderer) return;
    const updatedEvents = await ipcRenderer.invoke('update-event', updatedEvent);
    setEvents(updatedEvents);
  };

  const handleDeleteEvent = async (id: string) => {
    if (!ipcRenderer) return;
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
    const originalId = String(event.id).includes('-') ? event.id.split('-')[0] : event.id;
    const originalEvent = events.find(e => e.id === originalId) || event;
    setSelectedEvent(originalEvent);
    setSelectedDate(new Date(event.startDate || event.date));
    setIsModalOpen(true);
  };

  if (!isLoaded) return <div className="h-screen w-screen bg-white flex items-center justify-center text-google-gray">Loading...</div>;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white text-google-gray">
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
        <main className="flex-1 overflow-y-auto relative">
          {view === 'month' && (
            <MonthView 
              currentDate={currentDate} 
              events={visibleEvents} 
              onDayClick={handleDayClick}
              onEventClick={handleEventClick}
            />
          )}
          {view === 'week' && (
            <WeekView 
              currentDate={currentDate} 
              events={visibleEvents} 
              onTimeSlotClick={handleTimeSlotClick}
              onEventClick={handleEventClick}
            />
          )}
          {view === 'day' && (
            <DayView 
              currentDate={currentDate} 
              events={visibleEvents} 
              onTimeSlotClick={handleTimeSlotClick}
              onEventClick={handleEventClick}
            />
          )}
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