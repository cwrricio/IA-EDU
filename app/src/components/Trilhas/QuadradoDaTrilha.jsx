import React, { useMemo } from "react";
import "./styles/QuadradoDaTrilha.css";
import { FaLightbulb, FaStar, FaGraduationCap, FaBook } from "react-icons/fa";

const QuadradoDaTrilha = () => {
  // Array de mensagens motivacionais
  const mensagensMotivacionais = [
    {
      titulo: "Ei, já abriu sua trilha hoje?",
      mensagem: "O aprendizado constante leva ao sucesso!",
      icone: FaLightbulb
    },
    {
      titulo: "Não desista, você está indo bem!",
      mensagem: "Cada passo é uma conquista.",
      icone: FaStar
    },
    {
      titulo: "Conhecimento é poder!",
      mensagem: "Um pequeno esforço diário traz grandes resultados.",
      icone: FaBook
    },
    {
      titulo: "Continue aprendendo!",
      mensagem: "Sua dedicação vai transformar seu futuro.",
      icone: FaGraduationCap
    },
    {
      titulo: "Persistência é a chave!",
      mensagem: "Grandes mentes nunca param de aprender.",
      icone: FaBook
    }
  ];

  // Seleciona uma mensagem aleatória ao renderizar o componente
  const mensagemAleatoria = useMemo(() => {
    const indice = Math.floor(Math.random() * mensagensMotivacionais.length);
    return mensagensMotivacionais[indice];
  }, []);

  const IconComponent = mensagemAleatoria.icone;

  return (
    <div className="quadrado-trilha-container">
      <div className="quadrado-content">
        
        <h2>{mensagemAleatoria.titulo}</h2>
        <p className="motivational-message">{mensagemAleatoria.mensagem}</p>
      </div>
    </div>
  );
};

export default QuadradoDaTrilha;
