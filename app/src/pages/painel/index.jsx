import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import "./styles.css";
import Sidebar from "../../components/sidebar/Sidebar";
import api from "../../services/api";

const PainelPage = () => {
  const { id } = useParams(); // ID da trilha/curso
  const [loading, setLoading] = useState(true);
  const [estudantes, setEstudantes] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [ordenacao, setOrdenacao] = useState("Nome (A-Z)");
  const [curso, setCurso] = useState(null);

  useEffect(() => {
    const fetchEstudantesData = async () => {
      try {
        setLoading(true);
        
        // Verificar se temos um ID de trilha válido
        if (!id) {
          console.error("ID da trilha não fornecido");
          setLoading(false);
          return;
        }
        
        // Buscar dados da trilha
        const trilhaData = await api.getCourseById(id);
        setCurso(trilhaData);
        
        if (!trilhaData) {
          console.error("Trilha não encontrada");
          setLoading(false);
          return;
        }
        
        // Buscar usuários com role 'student'
        const usuarios = await api.getAllUsers();
        const estudantesUsuarios = usuarios.filter(u => u.role === "student");
        
        if (!estudantesUsuarios || estudantesUsuarios.length === 0) {
          // Se não há estudantes reais, usar dados fictícios
          const dadosFicticios = [
            {
              id: 1,
              nome: "Emanuel Carricio Ferreira",
              email: "emanuelferreira.aluno@unipampa.edu.br",
              repeticoes: 2,
              avancos: 5,
              progressoAtual: "35%",
              taxaAcerto: "78%",
            },
            {
              id: 2,
              nome: "Matheus Martins Ciocca",
              email: "matheusciocca2@gmail.com",
              repeticoes: 0,
              avancos: 8,
              progressoAtual: "65%",
              taxaAcerto: "92%",
            },
            {
              id: 3,
              nome: "Ana Clara Silveira",
              email: "anaclara@estudante.edu.br",
              repeticoes: 3,
              avancos: 12,
              progressoAtual: "87%",
              taxaAcerto: "95%",
            },
            {
              id: 4,
              nome: "Pedro Henrique Oliveira",
              email: "pedroh@aluno.edu.br",
              repeticoes: 5,
              avancos: 4,
              progressoAtual: "42%",
              taxaAcerto: "68%",
            },
            {
              id: 5,
              nome: "Juliana Mendes Santos",
              email: "julianams@estudante.edu.br",
              repeticoes: 1,
              avancos: 7,
              progressoAtual: "58%",
              taxaAcerto: "84%",
            },
            {
              id: 6,
              nome: "Ricardo Almeida Costa",
              email: "ricardoac@aluno.edu.br",
              repeticoes: 4,
              avancos: 9,
              progressoAtual: "76%",
              taxaAcerto: "81%",
            },
            {
              id: 7,
              nome: "Fernanda Gomes Silva",
              email: "fernandag@estudante.edu.br",
              repeticoes: 0,
              avancos: 6,
              progressoAtual: "50%",
              taxaAcerto: "88%",
            },
          ];
          setEstudantes(dadosFicticios);
          setLoading(false);
          return;
        }
        
        // Obter o total de conteúdos na trilha para cálculo de progresso
        const totalConteudos = trilhaData.steps?.content?.content_items?.length || 5;
        
        // Array para armazenar os dados processados dos estudantes
        const dadosEstudantes = [];
        
        // Para cada estudante, buscar seu progresso nesta trilha
        for (const estudante of estudantesUsuarios) {
          // Buscar progresso do estudante nesta trilha
          const progresso = await api.getUserProgressByCourse(estudante.id, id);
          
          // Se não tem progresso, significa que nunca acessou a trilha
          if (!progresso || Object.keys(progresso).length === 0) {
            dadosEstudantes.push({
              id: estudante.id,
              nome: estudante.username || "Estudante",
              email: estudante.email || "",
              repeticoes: 0,
              avancos: 0,
              progressoAtual: "0%",
              taxaAcerto: "0%"
            });
            continue;
          }
          
          // Calcular métricas baseadas no progresso
          let repeticoes = 0;
          let avancos = 0;
          let conteudosCompletos = 0;
          let totalQuizzesAvaliativos = 0;
          let acertosQuizzesAvaliativos = 0;
          
          // Percorrer cada item de conteúdo no progresso
          Object.entries(progresso).forEach(([contentId, contentProgress]) => {
            // Contar conteúdos completos para o progresso
            if (contentProgress.completed) {
              conteudosCompletos++;
            }
            
            // Contar avanços: quando a nota do quiz diagnóstico foi > 40%
            if (contentProgress.quiz_type === "quiz_diagnostico" && contentProgress.score > 40) {
              avancos++;
            }
            
            // Contar repetições: quando reprovou no quiz avaliativo (nota < 80%)
            if (contentProgress.quiz_type === "quiz_avaliativo" && contentProgress.score < 80) {
              repeticoes++;
            }
            
            // Calcular taxa de acerto nos quizzes avaliativos
            if (contentProgress.quiz_type === "quiz_avaliativo") {
              totalQuizzesAvaliativos++;
              acertosQuizzesAvaliativos += (contentProgress.score || 0);
            }
          });
          
          // Calcular progresso percentual
          // Verificar se concluiu totalmente o último conteúdo
          const ultimoContentId = String(totalConteudos);
          const concluiuUltimo = progresso[ultimoContentId]?.completed;
          
          // Se concluiu o último conteúdo, progresso é 100%
          let progressoPercentual = 0;
          if (concluiuUltimo) {
            progressoPercentual = 100;
          } else {
            // Caso contrário, baseado no número de conteúdos completos
            progressoPercentual = Math.round((conteudosCompletos / totalConteudos) * 100);
          }
          
          // Calcular taxa de acerto média
          const taxaAcertoMedia = totalQuizzesAvaliativos > 0 
            ? Math.round(acertosQuizzesAvaliativos / totalQuizzesAvaliativos) 
            : 0;
          
          // Adicionar dados do estudante ao array
          dadosEstudantes.push({
            id: estudante.id,
            nome: estudante.username || "Estudante",
            email: estudante.email || "",
            repeticoes,
            avancos,
            progressoAtual: `${progressoPercentual}%`,
            taxaAcerto: `${taxaAcertoMedia}%`
          });
        }
        
        // Se não temos dados reais mesmo depois da busca, usar os fictícios
        if (dadosEstudantes.length === 0) {
          const dadosFicticios = [
            {
              id: 1,
              nome: "Emanuel Carricio Ferreira",
              email: "emanuelferreira.aluno@unipampa.edu.br",
              repeticoes: 2,
              avancos: 5,
              progressoAtual: "35%",
              taxaAcerto: "78%",
            },
            {
              id: 2,
              nome: "Matheus Martins Ciocca",
              email: "matheusciocca2@gmail.com",
              repeticoes: 0,
              avancos: 8,
              progressoAtual: "65%",
              taxaAcerto: "92%",
            },
            {
              id: 3,
              nome: "Ana Clara Silveira",
              email: "anaclara@estudante.edu.br",
              repeticoes: 3,
              avancos: 12,
              progressoAtual: "87%",
              taxaAcerto: "95%",
            },
            {
              id: 4,
              nome: "Pedro Henrique Oliveira",
              email: "pedroh@aluno.edu.br",
              repeticoes: 5,
              avancos: 4,
              progressoAtual: "42%",
              taxaAcerto: "68%",
            },
            {
              id: 5,
              nome: "Juliana Mendes Santos",
              email: "julianams@estudante.edu.br",
              repeticoes: 1,
              avancos: 7,
              progressoAtual: "58%",
              taxaAcerto: "84%",
            },
            {
              id: 6,
              nome: "Ricardo Almeida Costa",
              email: "ricardoac@aluno.edu.br",
              repeticoes: 4,
              avancos: 9,
              progressoAtual: "76%",
              taxaAcerto: "81%",
            },
            {
              id: 7,
              nome: "Fernanda Gomes Silva",
              email: "fernandag@estudante.edu.br",
              repeticoes: 0,
              avancos: 6,
              progressoAtual: "50%",
              taxaAcerto: "88%",
            },
          ];
          setEstudantes(dadosFicticios);
        } else {
          setEstudantes(dadosEstudantes);
        }
      } catch (error) {
        console.error("Erro ao buscar dados dos estudantes:", error);
        
        // Em caso de erro, usar os dados fictícios
        const dadosFicticios = [
          {
            id: 1,
            nome: "Emanuel Carricio Ferreira",
            email: "emanuelferreira.aluno@unipampa.edu.br",
            repeticoes: 2,
            avancos: 5,
            progressoAtual: "35%",
            taxaAcerto: "78%",
          },
          {
            id: 2,
            nome: "Matheus Martins Ciocca",
            email: "matheusciocca2@gmail.com",
            repeticoes: 0,
            avancos: 8,
            progressoAtual: "65%",
            taxaAcerto: "92%",
          },
          {
            id: 3,
            nome: "Ana Clara Silveira",
            email: "anaclara@estudante.edu.br",
            repeticoes: 3,
            avancos: 12,
            progressoAtual: "87%",
            taxaAcerto: "95%",
          },
          {
            id: 4,
            nome: "Pedro Henrique Oliveira",
            email: "pedroh@aluno.edu.br",
            repeticoes: 5,
            avancos: 4,
            progressoAtual: "42%",
            taxaAcerto: "68%",
          },
          {
            id: 5,
            nome: "Juliana Mendes Santos",
            email: "julianams@estudante.edu.br",
            repeticoes: 1,
            avancos: 7,
            progressoAtual: "58%",
            taxaAcerto: "84%",
          },
          {
            id: 6,
            nome: "Ricardo Almeida Costa",
            email: "ricardoac@aluno.edu.br",
            repeticoes: 4,
            avancos: 9,
            progressoAtual: "76%",
            taxaAcerto: "81%",
          },
          {
            id: 7,
            nome: "Fernanda Gomes Silva",
            email: "fernandag@estudante.edu.br",
            repeticoes: 0,
            avancos: 6,
            progressoAtual: "50%",
            taxaAcerto: "88%",
          },
        ];
        setEstudantes(dadosFicticios);
      } finally {
        setLoading(false);
      }
    };

    fetchEstudantesData();
  }, [id]);

  const filtrarEstudantes = () => {
    return estudantes.filter(
      (estudante) =>
        estudante.nome.toLowerCase().includes(filtro.toLowerCase()) ||
        estudante.email.toLowerCase().includes(filtro.toLowerCase())
    );
  };

  const ordenarEstudantes = (estudantesFiltrados) => {
    switch (ordenacao) {
      case "Nome (A-Z)":
        return [...estudantesFiltrados].sort((a, b) =>
          a.nome.localeCompare(b.nome)
        );
      case "Nome (Z-A)":
        return [...estudantesFiltrados].sort((a, b) =>
          b.nome.localeCompare(a.nome)
        );
      case "Progresso (Maior-Menor)":
        return [...estudantesFiltrados].sort(
          (a, b) => parseInt(b.progressoAtual) - parseInt(a.progressoAtual)
        );
      case "Taxa de Acerto (Maior-Menor)":
        return [...estudantesFiltrados].sort(
          (a, b) => parseInt(b.taxaAcerto) - parseInt(a.taxaAcerto)
        );
      default:
        return estudantesFiltrados;
    }
  };

  const getProgressoClass = (progresso) => {
    const valor = parseInt(progresso);
    if (valor >= 80) return "progresso-alto";
    if (valor >= 50) return "progresso-medio";
    return "progresso-baixo";
  };

  const estudantesFiltradosOrdenados = ordenarEstudantes(filtrarEstudantes());

  return (
    <div className="painel-wrapper">
      <Sidebar />
      <div className="painel-content">
        <div className="painel-container-centralizado">
          <div className="resultados-section">
            <h2>Resultados dos Estudantes</h2>

            <div className="filtro-ordenacao">
              <div className="search-container">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Buscar estudante por nome ou email..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="ordenacao-container">
                <span className="ordenar-label">Ordenar por</span>
                <select
                  value={ordenacao}
                  onChange={(e) => setOrdenacao(e.target.value)}
                  className="ordenar-select"
                >
                  <option>Nome (A-Z)</option>
                  <option>Nome (Z-A)</option>
                  <option>Progresso (Maior-Menor)</option>
                  <option>Taxa de Acerto (Maior-Menor)</option>
                </select>
              </div>
            </div>

            {loading ? (
              <p className="loading-message">Carregando dados dos estudantes...</p>
            ) : (
              <div className="estudantes-lista">
                <div className="estudantes-cabecalho">
                  <div className="cabecalho-item cabecalho-estudante">Estudante</div>
                  <div className="cabecalho-item cabecalho-repeticoes">Repetições</div>
                  <div className="cabecalho-item cabecalho-avancos">Avanços</div>
                  <div className="cabecalho-item cabecalho-progresso">Progresso Atual</div>
                  <div className="cabecalho-item cabecalho-taxa">Taxa de Acerto</div>
                </div>
                
                {estudantesFiltradosOrdenados.map((estudante) => (
                  <div key={estudante.id} className="estudante-row">
                    <div className="estudante-col estudante-info">
                      <div className="avatar">
                        <span>{estudante.nome.charAt(0)}</span>
                      </div>
                      <div className="estudante-detalhes">
                        <div className="nome-estudante">{estudante.nome}</div>
                        <div className="email-estudante">{estudante.email}</div>
                      </div>
                    </div>
                    
                    <div className="estudante-col repeticoes-col">
                      {estudante.repeticoes}
                    </div>
                    
                    <div className="estudante-col avancos-col">
                      {estudante.avancos}
                    </div>
                    
                    <div className="estudante-col progresso-col">
                      <div className="barra-progresso-container">
                        <div 
                          className={`barra-progresso ${getProgressoClass(estudante.progressoAtual)}`} 
                          style={{ width: estudante.progressoAtual }}
                        ></div>
                      </div>
                      <div className="progresso-valor">{estudante.progressoAtual}</div>
                    </div>
                    
                    <div className="estudante-col taxa-col">
                      <div className="taxa-acerto">{estudante.taxaAcerto}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PainelPage;
