
import React from 'react';
import { Toast, ToastProvider } from "@radix-ui/react-toast";
import { TooltipProvider } from "@radix-ui/react-tooltip"; 
import { Toaster as Sonner } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Analysis from "./pages/Analysis";
import Recommendations from "./pages/Recommendations";
import Settings from "./pages/Settings";
import Models from "./pages/Models";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ToastProvider>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/models" element={<Models />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ToastProvider>
  </QueryClientProvider>
);

export default App;
