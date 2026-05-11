import React from 'react';
import { Plus, ChevronDown } from 'lucide-react';

interface SidebarProps {
  currentDate: Date;
  onDateSelect: (date: Date) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentDate }) => {
  return (
    <aside className="w-64 flex flex-col p-4 bg-white border-r border-google-border">
      <button className="flex items-center space-x-2 px-6 py-4 shadow-md rounded-full hover:shadow-lg transition-shadow bg-white mb-6 border border-google-border group">
        <Plus className="text-google-blue group-hover:scale-110 transition-transform" />
        <span className="font-medium text-google-gray">Create</span>
        <ChevronDown size={16} />
      </button>

      <div className="flex flex-col space-y-8 overflow-y-auto">
        {/* Mini Calendar Placeholder */}
        <div className="flex flex-col">
          <h3 className="text-sm font-medium text-google-gray mb-4">My calendars</h3>
          <div className="flex flex-col space-y-2">
            <CalendarToggle label="Bhanuka" color="bg-google-blue" checked={true} />
            <CalendarToggle label="Tasks" color="bg-orange-500" checked={true} />
            <CalendarToggle label="Reminders" color="bg-indigo-500" checked={false} />
          </div>
        </div>

        <div className="flex flex-col">
          <h3 className="text-sm font-medium text-google-gray mb-4">Other calendars</h3>
          <div className="flex flex-col space-y-2">
            <CalendarToggle label="Holidays in Sri Lanka" color="bg-green-600" checked={true} />
          </div>
        </div>
      </div>
    </aside>
  );
};

const CalendarToggle: React.FC<{ label: string; color: string; checked: boolean }> = ({ label, color, checked }) => (
  <div className="flex items-center space-x-3 px-2 py-1 hover:bg-google-hover rounded-md cursor-pointer group">
    <div className={`w-4 h-4 rounded-sm border ${checked ? color : 'border-gray-400'} flex items-center justify-center`}>
      {checked && <div className="w-2 h-2 bg-white rounded-full" />}
    </div>
    <span className="text-sm text-google-gray flex-1">{label}</span>
  </div>
);

export default Sidebar;
