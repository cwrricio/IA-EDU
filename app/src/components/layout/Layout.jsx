import { useEffect } from "react";
import Sidebar from "../sidebar/Sidebar";
import { useSidebar } from "../../contexts/SidebarContext";
import "./Layout.css";

const Layout = ({ children }) => {
  const { collapsed: sidebarCollapsed, toggleSidebar } = useSidebar();

  useEffect(() => {
    const handleResize = () => {
      // Você pode adicionar lógica aqui para ajustar automaticamente o estado
      // da sidebar baseado no tamanho da janela, se necessário
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
