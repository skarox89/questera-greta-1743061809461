import { motion } from 'framer-motion';
import { FaGripVertical, FaCog, FaTrash } from 'react-icons/fa';

export default function DraggableWidget({ 
  widget, 
  onConfigure, 
  onRemove,
  dragHandleProps 
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="bg-white rounded-lg shadow-md p-4 relative group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div {...dragHandleProps} className="cursor-move p-2 hover:text-primary-600">
            <FaGripVertical />
          </div>
          <h3 className="text-lg font-medium ml-2">{widget.title || widget.type}</h3>
        </div>
        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onConfigure(widget)}
            className="p-2 text-gray-400 hover:text-primary-600"
          >
            <FaCog />
          </button>
          <button
            onClick={() => onRemove(widget.id)}
            className="p-2 text-gray-400 hover:text-red-600"
          >
            <FaTrash />
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-500">
        <p>Query: {widget.query || 'No query configured'}</p>
        <p>Refresh: {widget.refreshInterval ? `${widget.refreshInterval}s` : 'Manual'}</p>
        {widget.variables?.length > 0 && (
          <p>Variables: {widget.variables.map(v => v.name).join(', ')}</p>
        )}
      </div>
    </motion.div>
  );
}