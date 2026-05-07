import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CharacterPage from "./pages/CharacterPage";
import EpisodePage from "./pages/EpisodePage";
import { Dialog, DialogContent } from "@/components/Dialog";
import { TooltipProvider } from "@/components/ui/tooltip";

function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;

  return (
    <>
      <Routes location={background ?? location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/character/:id" element={<CharacterPage />} />
        <Route path="/episode/:id" element={<EpisodePage />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path="/character/:id"
            element={
              <Dialog open onOpenChange={() => navigate(-1)}>
                <DialogContent>
                  <CharacterPage isModal />
                </DialogContent>
              </Dialog>
            }
          />
        </Routes>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <AppRoutes />
      </TooltipProvider>
    </BrowserRouter>
  );
}
