import React, { createContext, useContext, useState } from "react";

// Criando o contexto
const SidebarContext = createContext();

// Componente Provider
export const SidebarProvider = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed((prevState) => !prevState);
    console.log("Sidebar toggled:", !collapsed); // Para debug
  };

  return (
    <SidebarContext.Provider value={{ collapsed, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar deve ser usado dentro de um SidebarProvider");
  }
  return context;
};
