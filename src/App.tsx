import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import CharacterPage from "./pages/CharacterPage/CharacterPage";
import { Dialog, DialogContent } from "@/components/Dialog";

function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const background = location.state?.background;

  return (
    <>
      <Routes location={background ?? location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/character/:id" element={<CharacterPage />} />
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
      <AppRoutes />
    </BrowserRouter>
  );
}
