import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboard } from '../context/DashboardContext';
import DraggableWidget from '../components/DraggableWidget';
import WidgetConfigurator from '../components/WidgetConfigurator';
import { FaTable, FaChartPie, FaChartLine, FaChartBar } from 'react-icons/fa';

const WIDGET_TYPES = [
  { id: 'table', icon: FaTable, name: 'Table' },
  { id: 'pie', icon: FaChartPie, name: 'Pie Chart' },
  { id: 'line', icon: FaChartLine, name: 'Line Chart' },
  { id: 'bar', icon: FaChartBar, name: 'Bar Chart' },
];

export default function DashboardBuilder() {
  const { dashboardConfig, addWidget, removeWidget, reorderWidgets, updateWidget } = useDashboard();
  const [configuringWidget, setConfiguringWidget] = useState(null);
  const [selectedType, setSelectedType] = useState(null);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    if (result.type === 'WIDGET') {
      reorderWidgets(source.index, destination.index);
    } else if (result.type === 'WIDGET_TYPE') {
      setSelectedType(WIDGET_TYPES.find(type => type.id === result.draggableId));
    }
  };

  const handleSaveWidget = (config) => {
    if (configuringWidget) {
      updateWidget(configuringWidget.id, config);
    } else {
      addWidget({
        id: Date.now(),
        type: selectedType.id,
        ...config
      });
    }
    setConfiguringWidget(null);
    setSelectedType(null);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="h-full flex">
        <div className="w-64 bg-white shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4">Widgets</h2>
          <Droppable droppableId="WIDGET_TYPES" type="WIDGET_TYPE">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {WIDGET_TYPES.map((type, index) => (
                  <Draggable
                    key={type.id}
                    draggableId={type.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="flex items-center p-3 bg-gray-50 rounded-lg cursor-move hover:bg-gray-100"
                      >
                        <type.icon className="h-5 w-5 text-primary-600" />
                        <span className="ml-2">{type.name}</span>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        <div className="flex-1 p-6">
          <Droppable droppableId="DASHBOARD" type="WIDGET">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="min-h-[300px] p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300"
              >
                <AnimatePresence>
                  {dashboardConfig.map((widget, index) => (
                    <Draggable
                      key={widget.id}
                      draggableId={String(widget.id)}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="mb-4"
                        >
                          <DraggableWidget
                            widget={widget}
                            onConfigure={setConfiguringWidget}
                            onRemove={removeWidget}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                </AnimatePresence>
                {provided.placeholder}
                {!dashboardConfig.length && (
                  <div className="text-center py-12 text-gray-500">
                    Drag and drop widgets here to build your dashboard
                  </div>
                )}
              </div>
            )}
          </Droppable>
        </div>
      </div>

      {(selectedType || configuringWidget) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        >
          <WidgetConfigurator
            widgetType={configuringWidget?.type || selectedType?.name}
            initialConfig={configuringWidget}
            onSave={handleSaveWidget}
            onCancel={() => {
              setSelectedType(null);
              setConfiguringWidget(null);
            }}
          />
        </motion.div>
      )}
    </DragDropContext>
  );
}