import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import LoginPage from "./pages/login-page";
import HomePage from "./pages/home-page";
import ProfessorPage from "./pages/professor";
import TrilhasPage from "./pages/trilhas-page";
import UploadPage from "./pages/upload";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/home"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          } />

        <Route
          path="/professor"
          element={
            <PrivateRoute>
              <ProfessorPage />
            </PrivateRoute>
          } />

        <Route
          path="/trilhas"
          element={
            <PrivateRoute>
              <TrilhasPage />
            </PrivateRoute>
          } />

        <Route
          path="/upload"
          element={
            <PrivateRoute>
              <UploadPage />
            </PrivateRoute>
          } />

      </Routes>
      <ToastContainer position="bottom-right" />
    </BrowserRouter>
  );
}

// Fix: Added children prop and useLocation hook
function PrivateRoute({ children }) {
  const location = useLocation();
  const currentUser = localStorage.getItem("user");

  if (!currentUser) {
    // Pass the current location to be redirected back after login
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }
  
  // Return the children if authenticated
  return children;
}

export default App;