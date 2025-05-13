
import React from 'react';
import { Link } from 'react-router-dom';
import { ChartBar, ChartLine, TreeDeciduous } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: ChartBar,
  },
  {
    title: "Data Analysis",
    url: "/analysis",
    icon: ChartLine,
  },
  {
    title: "Recommendations",
    url: "/recommendations",
    icon: TreeDeciduous,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="flex items-center justify-start px-4 py-3">
        <div className="flex items-center space-x-2">
          <div className="rounded-full bg-gradient-to-br from-mind-blue-400 to-mind-green-500 p-1.5">
            <TreeDeciduous size={20} className="text-white" />
          </div>
          <div className="font-semibold text-lg">MindBloom AI</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton className={cn(
                    "flex items-center gap-2 w-full",
                    "hover:bg-mind-blue-50 hover:text-mind-blue-600 dark:hover:bg-mind-blue-900 dark:hover:text-mind-blue-300"
                  )} asChild>
                    <Link to={item.url}>
                      <item.icon size={18} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-4 py-3">
        <div className="text-xs text-muted-foreground">
          MindBloom AI Insights v1.0
          <br />
          © 2025 Mental Health AI Lab
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
