import React from "react";
import TrilhasHeader from "./TrilhasHeader";
import TrilhasCarousel from "./TrilhasCarousel";
import "./styles/Trilhas.css";

const Trilhas = () => {
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
    {
      id: 4,
      title: "Web Development Fundamentals",
      instructor: {
        name: "Maria Santos",
        role: "Front-end Developer",
        avatar: "https://randomuser.me/api/portraits/women/22.jpg",
      },
      status: "andamento",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
  ];

  return (
    <div className="trilhas-container">
      <TrilhasHeader />
      <TrilhasCarousel trilhas={trilhasData} />
    </div>
  );
};

export default Trilhas;
