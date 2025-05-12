import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import LoginPage from "./pages/login-page";
import HomePage from "./pages/home-page";
import ProfessorPage from "./pages/professor";
import TrilhasPage from "./pages/trilhas-page";
import SlidesPage from "./pages/slides";
import UploadPage from "./pages/upload";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { SidebarProvider } from "./contexts/SidebarContext";

function App() {
  return (
    <Router>
      <SidebarProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/home"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />

          <Route
            path="/professor"
            element={
              <PrivateRoute>
                <ProfessorPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/trilhas"
            element={
              <PrivateRoute>
                <TrilhasPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/upload"
            element={
              <PrivateRoute>
                <UploadPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/slides"
            element={
              <PrivateRoute>
                <SlidesPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/slides/:courseId"
            element={
              <PrivateRoute>
                <SlidesPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/slides/:courseId/:contentId?"
            element={
              <PrivateRoute>
                <SlidesPage />
              </PrivateRoute>
            }
          />
        </Routes>
        <ToastContainer position="bottom-right" />
      </SidebarProvider>
    </Router>
  );
}

// Fix: Added children prop and useLocation hook
function PrivateRoute({ children }) {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem("user") !== null;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default App;
