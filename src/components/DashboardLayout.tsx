
import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full brain-pattern-bg">
        <AppSidebar />
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold">MultiModal Mental Health Analysis</h1>
              <p className="text-sm text-muted-foreground">
                Hybrid Deep Learning Model: MH-Net + Transformer Fusion using DIAC, SEED, SEED-IV & SAVEE datasets
              </p>
              <div className="flex mt-1 text-xs text-muted-foreground">
                <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full mr-1">Inference: ≤45ms</span>
                <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full mr-1">Acc: ≥91.3%</span>
                <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">F1: ≥90.9%</span>
              </div>
            </div>
            <SidebarTrigger className="block md:hidden" />
          </div>
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
