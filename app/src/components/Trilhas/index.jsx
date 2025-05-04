import React, { useState } from "react";
import TrilhasHeader from "./TrilhasHeader";
import TrilhasCarousel from "./TrilhasCarousel";
import "./styles/Trilhas.css";
import ContinueLearning from "./ContinueLearning";
import QuadradoDaTrilha from "./QuadradoDaTrilha";

const Trilhas = () => {
  // Adicionar estado para filtrar trilhas
  const [filtro, setFiltro] = useState("all");

  // Dados de exemplo para as trilhas
  const trilhasData = [
    {
      id: 1,
      title: "Introduction 3d Design",
      instructor: {
        name: "Oliva Wilson",
        role: "Expert in Design",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      },
      status: "concluido",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      id: 2,
      title: "Introduction UX Designer",
      instructor: {
        name: "Jonathan Patterson",
        role: "Senior UX Designer / UI Developer",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      },
      status: "concluido",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      id: 3,
      title: "Motion Graphic Learning",
      instructor: {
        name: "Takehiro Kaneyy",
        role: "Motion Artist / Visual Arts Partner",
        avatar: "https://randomuser.me/api/portraits/men/68.jpg",
      },
      status: "andamento",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
  ];

  // Filtrar trilhas de acordo com o status selecionado
  const trilhasFiltradas =
    filtro === "all"
      ? trilhasData
      : trilhasData.filter((trilha) => trilha.status === filtro);

  // Handler para quando o filtro muda no TrilhasHeader
  const handleFiltroChange = (novoFiltro) => {
    setFiltro(novoFiltro);
  };

  return (
    <div className="trilhas-container">
      <div className="featured-content-row">
        <ContinueLearning />
        <QuadradoDaTrilha />
      </div>
      <TrilhasHeader onFiltroChange={handleFiltroChange} filtroAtual={filtro} />
      <TrilhasCarousel trilhas={trilhasFiltradas} />
    </div>
  );
};

export default Trilhas;
