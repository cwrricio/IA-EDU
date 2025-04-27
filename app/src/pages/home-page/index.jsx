import React from "react";
import Layout from "../../components/layout/Layout";
import "./home-page.css";

const HomePage = () => {
  return (
    <Layout>
      {/* Conteúdo da página inicial vai aqui */}
      <div className="home-content">
        <h1>Bem-vindo à Plataforma MentorIA</h1>
        <p>Utilize o menu lateral para navegar entre as funcionalidades.</p>
      </div>
    </Layout>
  );
};

export default HomePage;
