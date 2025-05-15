import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import api from "../../services/api";

const PainelPage = () => {
  const { id } = useParams();
  const [trilha, setTrilha] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrilhaData = async () => {
      if (!id) return;

      try {
        const trilhaData = await api.getCourseById(id);
        setTrilha(trilhaData);
      } catch (error) {
        console.error("Erro ao buscar dados da trilha:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrilhaData();
  }, [id]);

  return (
    <Sidebar>
      <div>
        <h1>Painel de {trilha?.title || "Trilha"}</h1>
        {loading ? (
          <p>Carregando dados da trilha...</p>
        ) : (
          <div>
            {/* Conteúdo do painel com os dados da trilha */}
            <p>ID da trilha: {id}</p>
            {/* Outros elementos do painel */}
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default PainelPage;
