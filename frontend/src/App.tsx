import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/index.tsx";
import Detail from "./pages/Detail.tsx";
import Browse from "./pages/Browse.tsx";
import RadioStation from "./pages/RadioStation.tsx";
import Status from "./pages/Status.tsx";
import NotFound from "./pages/NotFound.tsx";
import { PlayerProvider } from "./context/PlayerContext";
import { LibraryProvider } from "./context/LibraryContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <PlayerProvider>
        <LibraryProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/browse" element={<Browse />} />
          <Route path="/radio/:id" element={<RadioStation />} />
          <Route path="/status" element={<Status />} />
              <Route path="/:type/:id/:channelName?" element={<Detail />} />
                              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </LibraryProvider>
      </PlayerProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
