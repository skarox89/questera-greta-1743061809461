import { motion } from 'framer-motion';
import { FaCopy } from 'react-icons/fa';

export default function QueryPreview({ query }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(query);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg p-4 relative group"
    >
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleCopy}
          className="p-2 text-gray-400 hover:text-white"
          title="Copy to clipboard"
        >
          <FaCopy />
        </button>
      </div>
      <pre className="text-green-400 font-mono text-sm overflow-x-auto whitespace-pre-wrap">
        {query}
      </pre>
    </motion.div>
  );
}