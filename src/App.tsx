import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Opportunities from "./pages/Opportunities.tsx";
import CreateOpportunity from "./pages/CreateOpportunity.tsx";
import AdminApplications from "./pages/admin/AdminApplications.tsx";
import AdminApplicationDetail from "./pages/admin/AdminApplicationDetail.tsx";
import AdminStudents from "./pages/admin/AdminStudents.tsx";
import AdminStudentDetail from "./pages/admin/AdminStudentDetail.tsx";
import AdminReports from "./pages/admin/AdminReports.tsx";
import AdminSettings from "./pages/admin/AdminSettings.tsx";
import AdminAnalytics from "./pages/admin/AdminAnalytics.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/opportunities/create" element={<CreateOpportunity />} />
          <Route path="/admin/applications" element={<AdminApplications />} />
          <Route path="/admin/applications/:id" element={<AdminApplicationDetail />} />
          <Route path="/admin/students" element={<AdminStudents />} />
          <Route path="/admin/students/:id" element={<AdminStudentDetail />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
