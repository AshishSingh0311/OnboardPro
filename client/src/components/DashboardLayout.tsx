import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  BarChart, 
  ListChecks, 
  Settings, 
  Database, 
  Brain,
  HelpCircle,
  GitBranch,
  LogOut
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const isActivePath = (path: string) => {
    if (path === '/' && currentPath === '/') {
      return true;
    }
    if (path !== '/' && currentPath.startsWith(path)) {
      return true;
    }
    return false;
  };
  
  const navigationLinks = [
    { name: 'Dashboard', path: '/', icon: <Home className="h-5 w-5" /> },
    { name: 'Analysis', path: '/analysis', icon: <BarChart className="h-5 w-5" /> },
    { name: 'Recommendations', path: '/recommendations', icon: <ListChecks className="h-5 w-5" /> },
    { name: 'Models', path: '/models', icon: <Brain className="h-5 w-5" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="h-5 w-5" /> },
  ];
  
  const secondaryLinks = [
    { name: 'Documentation', path: '/docs', icon: <HelpCircle className="h-5 w-5" /> },
    { name: 'API', path: '/api', icon: <GitBranch className="h-5 w-5" /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 border-r border-gray-200 bg-white">
        <div className="p-4 border-b">
          <div className="flex items-center justify-center">
            <Brain className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-xl font-bold text-gray-900">MindBloom AI</h1>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <nav className="space-y-1">
            {navigationLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  isActivePath(link.path)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={`mr-3 ${isActivePath(link.path) ? 'text-blue-500' : 'text-gray-400'}`}>
                  {link.icon}
                </span>
                {link.name}
              </Link>
            ))}
          </nav>
          
          <div className="pt-6 mt-6 border-t border-gray-200">
            <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Support
            </h3>
            <nav className="mt-2 space-y-1">
              {secondaryLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
                >
                  <span className="mr-3 text-gray-400">{link.icon}</span>
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        
        <div className="p-4 border-t flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">U</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">User</p>
              <p className="text-xs text-gray-500">Researcher</p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-500">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Brain className="h-6 w-6 text-blue-600 mr-2" />
            <h1 className="text-lg font-bold text-gray-900">MindBloom AI</h1>
          </div>
          <button className="text-gray-500 hover:text-gray-700">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;