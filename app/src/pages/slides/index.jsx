import React from "react";
import Layout from "../../components/layout/Layout";
import SlideLayout from "../../components/slideLayout/slideLayout";
import "./slides-page.css";

const SlidesPage = () => {
  return (
    <Layout>
      <div className="slides-page-container">
        <SlideLayout>
          <h1 className="slide-title">Introdução ao Curso</h1>
          <div className="slide-content-block">
            <p>
              Este é um exemplo de slide para sua apresentação. Aqui você pode
              incluir o conteúdo do seu curso, como texto, imagens, vídeos e
              muito mais.
            </p>

            <h2>Principais tópicos</h2>
            <ul>
              <li>Fundamentos teóricos</li>
              <li>Aplicações práticas</li>
              <li>Estudos de caso</li>
              <li>Exercícios e atividades</li>
            </ul>

            <p>
              Use os controles na parte inferior para navegar entre os slides.
            </p>
          </div>
        </SlideLayout>
      </div>
    </Layout>
  );
};

export default SlidesPage;
