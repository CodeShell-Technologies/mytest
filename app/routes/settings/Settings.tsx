import { DollarSign, SquareCheckBig, TicketCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Settings() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link 
          to="/settings/access-permission/roles" 
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
              <SquareCheckBig className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Access Permission</h2>
          </div>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Manage roles, user permissions, and team access controls
          </p>
        </Link>

        <Link 
          to="/settings/invoice/tax" 
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
              <DollarSign className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Invoice Settings</h2>
          </div>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Configure tax rates, payment methods, and invoice templates
          </p>
        </Link>

          <Link 
          to="/settings/access-permission/systemsetting" 
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
              <TicketCheck className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">System Settings</h2>
          </div>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Configure system preferences and global settings Like Software Language and Holidays Settings
          </p>
        </Link>
     
      </div>

     
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
            <p className="text-gray-600 dark:text-gray-300">Updated tax rates</p>
            <span className="text-sm text-gray-500 dark:text-gray-400">2 hours ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
            <p className="text-gray-600 dark:text-gray-300">Created new user role</p>
            <span className="text-sm text-gray-500 dark:text-gray-400">1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}