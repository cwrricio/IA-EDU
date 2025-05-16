import React from "react";
import Layout from "../../components/layout/Layout";
import YouTubeVideo from "../../components/YouTubeVideo/YouTubeVideo";
import "./home-page.css";

const HomePage = () => {
  // URL do vídeo definida diretamente no código
  // Você pode alterar esta URL para qualquer vídeo do YouTube
  const videoUrl = "https://www.youtube.com/watch?v=9af5KyWskRk";

  return (
    <Layout>
      <div className="home-container">
        <div className="home-welcome">
          <h1 className="home-title">Bem-vindo à Plataforma MentorIA</h1>
          <p className="home-subtitle">
            Utilize o menu lateral para navegar entre as funcionalidades.
          </p>

          <YouTubeVideo videoUrl={videoUrl} />
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
