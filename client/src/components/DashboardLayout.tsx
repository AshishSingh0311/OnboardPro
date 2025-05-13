import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  BarChart2, 
  Lightbulb, 
  Database, 
  Brain, 
  Settings, 
  Menu, 
  Search, 
  Bell, 
  HelpCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  const NavItem = ({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) => {
    const isActive = location.pathname === href;
    
    return (
      <Link 
        to={href}
        className={cn(
          "flex items-center px-3 py-2 text-sm font-medium rounded-md",
          isActive 
            ? "bg-mind-blue-50 text-mind-blue-700" 
            : "text-gray-700 hover:bg-gray-50"
        )}
      >
        <div className={cn(
          "mr-3", 
          isActive ? "text-mind-blue-500" : "text-gray-500"
        )}>
          {icon}
        </div>
        {children}
      </Link>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transition-transform duration-300 md:translate-x-0 md:static md:flex md:flex-shrink-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col w-64">
          <div className="flex items-center h-16 px-4 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-mind-blue-700">MindBloom AI</h1>
          </div>
          <div className="h-0 flex-1 flex flex-col overflow-y-auto pt-4">
            <nav className="flex-1 px-2 space-y-1">
              <NavItem href="/" icon={<Home size={18} />}>
                Dashboard
              </NavItem>
              <NavItem href="/analysis" icon={<BarChart2 size={18} />}>
                Analysis
              </NavItem>
              <NavItem href="/recommendations" icon={<Lightbulb size={18} />}>
                Recommendations
              </NavItem>
              <NavItem href="/datasets" icon={<Database size={18} />}>
                Datasets
              </NavItem>
              <NavItem href="/models" icon={<Brain size={18} />}>
                Models
              </NavItem>
              <NavItem href="/settings" icon={<Settings size={18} />}>
                Settings
              </NavItem>
            </nav>
            <div className="px-4 py-4 border-t border-gray-200">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 bg-mind-blue-500 text-white">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">Dr. Jane Doe</p>
                  <p className="text-xs text-gray-500">Clinical Psychologist</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navbar */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden px-4 text-gray-500"
          >
            <Menu size={24} />
          </Button>
          <div className="flex-1 flex justify-between px-4">
            <div className="flex-1 flex items-center">
              <div className="w-full max-w-2xl relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search patients, datasets, or models" 
                  className="pl-9 pr-3"
                />
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-500">
                <Bell size={20} />
              </Button>
              <Button variant="ghost" size="icon" className="ml-3 text-gray-400 hover:text-gray-500">
                <HelpCircle size={20} />
              </Button>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50 brain-pattern-bg">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
