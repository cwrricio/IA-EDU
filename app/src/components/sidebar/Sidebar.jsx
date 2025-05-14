import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  VscHome,
  VscBook,
  VscSignOut,
  VscQuestion,
  VscPerson,
} from "react-icons/vsc";
import { useSidebar } from "../../contexts/SidebarContext";
import "./styles/Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { collapsed, toggleSidebar } = useSidebar();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem("user"); // Remove user data from localStorage
    handleNavigation("/login");
  };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo-container">
          <img src="/mentor.svg" alt="MentorIA Logo" className="sidebar-logo" />
          {!collapsed && (
            <div className="sidebar-title-container">
              <h1 className="sidebar-title">MentorIA</h1>
              <p className="sidebar-subtitle">Trilhas de aprendizagem</p>
            </div>
          )}
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          <li
            className={`sidebar-menu-item ${isActive("/home") ? "active" : ""}`}
            onClick={() => handleNavigation("/home")}
          >
            <VscHome className="sidebar-icon" />
            {!collapsed && <span>Home</span>}
          </li>

          <li
            className={`sidebar-menu-item ${
              isActive("/trilhas") ? "active" : ""
            }`}
            onClick={() => handleNavigation("/trilhas")}
          >
            <VscBook className="sidebar-icon" />
            {!collapsed && <span>Trilhas</span>}
          </li>

          <li
            className={`sidebar-menu-item ${
              isActive("/professor") ? "active" : ""
            }`}
            onClick={() => handleNavigation("/professor")}
          >
            <VscPerson className="sidebar-icon" />
            {!collapsed && <span>Professor</span>}
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-help" onClick={handleLogout}>
          <VscSignOut className="sidebar-icon" />
          {!collapsed && <span>Sair</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
