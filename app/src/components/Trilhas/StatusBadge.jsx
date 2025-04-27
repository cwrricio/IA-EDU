import React from "react";
import "./styles/StatusBadge.css";

const StatusBadge = ({ status }) => {
  const getStatusText = () => {
    return status === "concluido" ? "A+" : "A";
  };

  return <div className={`status-badge ${status}`}>{getStatusText()}</div>;
};

export default StatusBadge;
