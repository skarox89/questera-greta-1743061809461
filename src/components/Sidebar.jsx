import { useState } from 'react';
import { FaChartPie, FaTable, FaChartLine, FaChartBar } from 'react-icons/fa';

export default function Sidebar() {
  const [widgets] = useState([
    { id: 'table', icon: FaTable, name: 'Table' },
    { id: 'pie', icon: FaChartPie, name: 'Pie Chart' },
    { id: 'line', icon: FaChartLine, name: 'Line Chart' },
    { id: 'bar', icon: FaChartBar, name: 'Bar Chart' },
  ]);

  const onDragStart = (e, widgetType) => {
    e.dataTransfer.setData('widgetType', widgetType);
  };

  return (
    <div className="w-64 bg-white shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4">Widgets</h2>
      <div className="space-y-2">
        {widgets.map((widget) => (
          <div
            key={widget.id}
            draggable
            onDragStart={(e) => onDragStart(e, widget.id)}
            className="flex items-center p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100"
          >
            <widget.icon className="h-5 w-5 text-primary-600" />
            <span className="ml-2">{widget.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}