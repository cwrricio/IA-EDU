import React from "react";
import { FaCheck, FaClock } from "react-icons/fa";
import "./styles/StatusBadge.css";

const StatusBadge = ({ status }) => {
  const renderStatusIcon = () => {
    if (status === "concluido") {
      return <FaCheck className="status-icon" />;
    } else {
      return <FaClock className="status-icon" />;
    }
  };

  return <div className={`status-badge ${status}`}>{renderStatusIcon()}</div>;
};

export default StatusBadge;
