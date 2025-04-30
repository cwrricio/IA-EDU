import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/layout/Layout";
import "./professor.css";

const ProfessorPage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "IA na Educação Básica",
      status: "Concluído",
      date: "15/05/2024",
    },
    {
      id: 2,
      title: "Ferramentas de IA para Ensino Superior",
      status: "Em andamento",
      date: "20/05/2024",
    },
  ]);

  const handleNewProject = () => {
    navigate("/upload");
  };

  return (
    <Layout>
      <div className="professor-container">
        <div className="professor-header">
          <h1 className="professor-title">Meus Projetos</h1>
          <button className="professor-new-btn" onClick={handleNewProject}>
            Novo Projeto
          </button>
        </div>

        <div className="professor-content">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <h3 className="project-title">{project.title}</h3>
              <div className="project-details">
                <span
                  className={`project-status ${
                    project.status === "Concluído" ? "completed" : "in-progress"
                  }`}
                >
                  {project.status}
                </span>
                <span className="project-date">
                  Atualizado em: {project.date}
                </span>
              </div>
              <div className="project-actions">
                <button className="project-view-btn">Ver projeto</button>
                <button className="project-edit-btn">Editar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProfessorPage;
