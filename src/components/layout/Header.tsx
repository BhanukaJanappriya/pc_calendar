import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Menu, Search, HelpCircle, Settings, Grid, ChevronDown } from 'lucide-react';
import { format, startOfWeek, endOfWeek, isSameMonth } from 'date-fns';
import { CalendarViewType } from '../../types/calendar';

interface HeaderProps {
  currentDate: Date;
  onNext: () => void;
  onPrev: () => void;
  onToday: () => void;
  view: CalendarViewType;
  onViewChange: (view: CalendarViewType) => void;
}

const Header: React.FC<HeaderProps> = ({ currentDate, onNext, onPrev, onToday, view, onViewChange }) => {
  const [isViewSelectorOpen, setIsViewSelectorOpen] = useState(false);

  const getHeaderDate = () => {
    if (view === 'month') {
      return format(currentDate, 'MMMM yyyy');
    } else if (view === 'week') {
      const start = startOfWeek(currentDate);
      const end = endOfWeek(currentDate);
      if (isSameMonth(start, end)) {
        return format(start, 'MMMM yyyy');
      } else {
        return `${format(start, 'MMM')} – ${format(end, 'MMM yyyy')}`;
      }
    } else {
      return format(currentDate, 'MMMM d, yyyy');
    }
  };

  const views: { label: string; value: CalendarViewType }[] = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
  ];

  return (
    <header className="h-16 border-b border-google-border flex items-center px-4 justify-between bg-white z-50">
      <div className="flex items-center space-x-4">
        <button className="p-2 hover:bg-google-hover rounded-full text-google-gray">
          <Menu size={24} />
        </button>
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-google-blue rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-xl">31</span>
          </div>
          <span className="text-2xl text-google-gray font-medium">Calendar</span>
        </div>
        
        <div className="flex items-center ml-8 space-x-2">
          <button 
            onClick={onToday}
            className="px-4 py-2 border border-google-border rounded-md hover:bg-google-hover font-medium text-sm transition-colors"
          >
            Today
          </button>
          <div className="flex items-center">
            <button onClick={onPrev} className="p-2 hover:bg-google-hover rounded-full">
              <ChevronLeft size={20} />
            </button>
            <button onClick={onNext} className="p-2 hover:bg-google-hover rounded-full">
              <ChevronRight size={20} />
            </button>
          </div>
          <h2 className="text-xl text-google-gray font-normal ml-2">
            {getHeaderDate()}
          </h2>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button className="p-2 hover:bg-google-hover rounded-full">
          <Search size={22} />
        </button>
        <button className="p-2 hover:bg-google-hover rounded-full">
          <HelpCircle size={22} />
        </button>
        <button className="p-2 hover:bg-google-hover rounded-full">
          <Settings size={22} />
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setIsViewSelectorOpen(!isViewSelectorOpen)}
            className="flex items-center ml-2 border border-google-border rounded-md px-4 py-2 hover:bg-google-hover cursor-pointer"
          >
            <span className="text-sm font-medium capitalize">{view}</span>
            <ChevronDown className="ml-2" size={14} />
          </button>
          
          {isViewSelectorOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-white border border-google-border rounded-md shadow-lg py-1 z-[100]">
              {views.map((v) => (
                <button
                  key={v.value}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-google-hover ${view === v.value ? 'bg-blue-50 text-google-blue' : 'text-google-gray'}`}
                  onClick={() => {
                    onViewChange(v.value);
                    setIsViewSelectorOpen(false);
                  }}
                >
                  {v.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="p-2 hover:bg-google-hover rounded-full ml-4">
          <Grid size={22} />
        </button>
        <div className="w-8 h-8 rounded-full bg-google-blue text-white flex items-center justify-center text-xs font-bold ml-2">
          B
        </div>
      </div>
    </header>
  );
};

export default Header;
