import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/home-page";
import ProfessorPage from "./pages/professor";
import TrilhasPage from "./pages/trilhas-page"; // Corrigido o caminho
import UploadPage from "./pages/upload";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/professor" element={<ProfessorPage />} />
        <Route path="/trilhas" element={<TrilhasPage />} />
        <Route path="/upload" element={<UploadPage />} />
      </Routes>
      <ToastContainer position="bottom-right" />
    </BrowserRouter>
  );
}

export default App;
