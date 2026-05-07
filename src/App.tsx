import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import HomePage from "./pages/HomePage/HomePage";
import CharacterPage from "./pages/CharacterPage/CharacterPage";
import { Dialog, DialogContent } from "@/components/Dialog";

export default function App() {
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage onCharacterSelect={setSelectedCharacterId} />
          }
        />
        <Route path="/character/:id" element={<CharacterPage />} />
      </Routes>

      <Dialog open={!!selectedCharacterId} onOpenChange={() => setSelectedCharacterId(null)}>
        <DialogContent>
          {selectedCharacterId && (
            <CharacterPage characterId={selectedCharacterId} isModal />
          )}
        </DialogContent>
      </Dialog>
    </BrowserRouter>
  );
}
