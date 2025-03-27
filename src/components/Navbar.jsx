import { Link } from 'react-router-dom';
import { FaCog, FaDatabase, FaTachometerAlt } from 'react-icons/fa';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <FaTachometerAlt className="h-6 w-6 text-primary-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">
                Software Inventory
              </span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/configure"
              className="text-gray-600 hover:text-gray-900 flex items-center"
            >
              <FaDatabase className="h-5 w-5" />
              <span className="ml-2">Database</span>
            </Link>
            <Link
              to="/builder"
              className="text-gray-600 hover:text-gray-900 flex items-center"
            >
              <FaCog className="h-5 w-5" />
              <span className="ml-2">Dashboard Builder</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}