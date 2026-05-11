import React, { useState, useEffect } from 'react';
import { X, Clock, AlignLeft, Calendar as CalendarIcon, Trash2, Repeat, Palette } from 'lucide-react';
import { format, addHours, parseISO } from 'date-fns';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onSave: (event: any) => void;
  existingEvent?: any;
  onDelete?: (id: string) => void;
  onUpdate?: (event: any) => void;
}

const COLORS = [
  { name: 'Lavender', value: '#7986cb' },
  { name: 'Sage', value: '#33b679' },
  { name: 'Grape', value: '#8e24aa' },
  { name: 'Flamingo', value: '#e67c73' },
  { name: 'Banana', value: '#f6bf26' },
  { name: 'Tangerine', value: '#f4511e' },
  { name: 'Peacock', value: '#039be5' },
  { name: 'Graphite', value: '#616161' },
];

const RECURRENCE_OPTIONS = [
  { label: 'Does not repeat', value: 'none' },
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
];

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, selectedDate, onSave, existingEvent, onDelete, onUpdate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(format(selectedDate, "yyyy-MM-dd'T'HH:mm"));
  const [endDate, setEndDate] = useState(format(addHours(selectedDate, 1), "yyyy-MM-dd'T'HH:mm"));
  const [color, setColor] = useState(COLORS[6].value); // Peacock blue default
  const [recurrence, setRecurrence] = useState('none');
  const [isAllDay, setIsAllDay] = useState(false);

  useEffect(() => {
    if (existingEvent) {
      setTitle(existingEvent.title || '');
      setDescription(existingEvent.description || '');
      setStartDate(existingEvent.startDate || format(new Date(existingEvent.date), "yyyy-MM-dd'T'HH:mm"));
      setEndDate(existingEvent.endDate || format(addHours(new Date(existingEvent.date), 1), "yyyy-MM-dd'T'HH:mm"));
      setColor(existingEvent.color || COLORS[6].value);
      setRecurrence(existingEvent.recurrence || 'none');
      setIsAllDay(existingEvent.allDay || false);
    } else {
      setTitle('');
      setDescription('');
      const start = new Date(selectedDate);
      start.setHours(new Date().getHours() + 1, 0, 0, 0);
      const end = addHours(start, 1);
      setStartDate(format(start, "yyyy-MM-dd'T'HH:mm"));
      setEndDate(format(end, "yyyy-MM-dd'T'HH:mm"));
      setColor(COLORS[6].value);
      setRecurrence('none');
      setIsAllDay(false);
    }
  }, [existingEvent, isOpen, selectedDate]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title) return;
    
    const eventData = {
      title,
      description,
      startDate,
      endDate,
      date: startDate, // Maintain backward compatibility
      color,
      recurrence,
      allDay: isAllDay,
    };

    if (existingEvent && onUpdate) {
      onUpdate({
        ...existingEvent,
        ...eventData,
      });
    } else {
      onSave(eventData);
    }
    onClose();
  };

  const handleDelete = () => {
    if (existingEvent && onDelete) {
      onDelete(existingEvent.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-lg shadow-2xl w-[500px] overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 flex items-center justify-between border-b border-google-border">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-google-gray">
              {existingEvent ? 'Edit event' : 'Add event'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {existingEvent && (
              <button onClick={handleDelete} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <Trash2 size={18} className="text-red-500" />
              </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              <X size={20} className="text-google-gray" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-start space-x-4">
            <div className="w-6" />
            <input
              autoFocus
              placeholder="Add title"
              className="text-2xl w-full border-b border-transparent focus:border-google-blue outline-none py-1 transition-colors"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="flex items-start space-x-4">
            <Clock size={20} className="text-google-light-gray w-6 mt-1" />
            <div className="flex-1 space-y-3">
              <div className="flex items-center space-x-2">
                <input 
                  type="datetime-local" 
                  className="text-sm border border-google-border rounded px-2 py-1 outline-none focus:border-google-blue"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <span className="text-google-gray">–</span>
                <input 
                  type="datetime-local" 
                  className="text-sm border border-google-border rounded px-2 py-1 outline-none focus:border-google-blue"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="allDay" 
                  checked={isAllDay}
                  onChange={(e) => setIsAllDay(e.target.checked)}
                  className="rounded border-google-border text-google-blue focus:ring-google-blue"
                />
                <label htmlFor="allDay" className="text-sm text-google-gray cursor-pointer">All day</label>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Repeat size={20} className="text-google-light-gray w-6" />
            <select 
              className="text-sm border border-google-border rounded px-2 py-1 outline-none focus:border-google-blue bg-white"
              value={recurrence}
              onChange={(e) => setRecurrence(e.target.value)}
            >
              {RECURRENCE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-start space-x-4">
            <Palette size={20} className="text-google-light-gray w-6 mt-1" />
            <div className="flex flex-wrap gap-2">
              {COLORS.map(c => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${color === c.value ? 'border-gray-400 scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <AlignLeft size={20} className="text-google-light-gray w-6 mt-1" />
            <textarea
              placeholder="Add description"
              className="w-full text-sm outline-none bg-gray-50 p-3 rounded-md focus:bg-white border border-transparent focus:border-google-border transition-colors min-h-[100px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="px-6 py-4 flex justify-end space-x-2 border-t border-google-border bg-gray-50">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-google-gray hover:bg-gray-100 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2 text-sm font-medium text-white bg-google-blue hover:bg-blue-700 rounded-md shadow-sm transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
