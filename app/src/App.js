import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "./contexts/SidebarContext";
import SlidesPage from "./pages/slides";
// ... outros imports

function App() {
  return (
    <SidebarProvider>
      <BrowserRouter>
        <Routes>
          {/* Suas rotas aqui */}
          <Route path="/slides" element={<SlidesPage />} />
          {/* Outras rotas */}
        </Routes>
      </BrowserRouter>
    </SidebarProvider>
  );
}

export default App;
