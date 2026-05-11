import React, { useState, useEffect } from 'react';
import { X, Clock, AlignLeft, Calendar as CalendarIcon, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onSave: (event: any) => void;
  existingEvent?: any;
  onDelete?: (id: string) => void;
  onUpdate?: (event: any) => void;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, selectedDate, onSave, existingEvent, onDelete, onUpdate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (existingEvent) {
      setTitle(existingEvent.title || '');
      setDescription(existingEvent.description || '');
    } else {
      setTitle('');
      setDescription('');
    }
  }, [existingEvent, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title) return;
    
    if (existingEvent && onUpdate) {
      onUpdate({
        ...existingEvent,
        title,
        description,
      });
    } else {
      onSave({
        title,
        description,
        date: selectedDate.toISOString(),
      });
    }
    setTitle('');
    setDescription('');
    onClose();
  };

  const handleDelete = () => {
    if (existingEvent && onDelete) {
      onDelete(existingEvent.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-[448px] overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 flex items-center justify-between border-b border-google-border">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-google-gray">
              {existingEvent ? 'Edit event' : 'Add event'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {existingEvent && (
              <button onClick={handleDelete} className="p-2 hover:bg-gray-200 rounded-full">
                <Trash2 size={18} className="text-red-500" />
              </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full">
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

          <div className="flex items-center space-x-4">
            <CalendarIcon size={20} className="text-google-light-gray w-6" />
            <span className="text-sm text-google-gray">
              {format(existingEvent && existingEvent.date ? new Date(existingEvent.date) : selectedDate, 'EEEE, MMMM d')}
            </span>
          </div>

          <div className="flex items-start space-x-4">
            <Clock size={20} className="text-google-light-gray w-6 mt-1" />
            <div className="flex items-center space-x-2 text-sm text-google-gray">
              <span>All day</span>
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

        <div className="px-6 py-4 flex justify-end space-x-2">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-google-gray hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2 text-sm font-medium text-white bg-google-blue hover:bg-blue-700 rounded-md shadow-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
