import { useState, useEffect } from "react";
import Sidebar from "../sidebar/Sidebar";
import "./Layout.css";

const Layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    window.innerWidth <= 768
  );

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="layout">
      <Sidebar collapsed={sidebarCollapsed} />
      <div
        className={`content-area ${
          sidebarCollapsed ? "sidebar-collapsed" : ""
        }`}
      >

        <main className="main-content">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
