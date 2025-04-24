import ContentItemComponent from "./ContentItemComponent";
import "./styles/ContentListComponent.css";

const ContentListComponent = ({ onBack, onContinue }) => {
  // Dados de exemplo - seriam obtidos da API no futuro
  const contentItems = [
    {
      id: 1,
      title: "Introdução à Programação",
      description: "Fundamentos e conceitos básicos de programação.",
      content: `
        <p>Neste módulo, vamos explorar os conceitos fundamentais da programação, incluindo:</p>
        <ul>
          <li>Algoritmos e lógica de programação</li>
          <li>Variáveis e tipos de dados</li>
          <li>Estruturas de controle (condicionais e loops)</li>
          <li>Funções e procedimentos</li>
          <li>Introdução à orientação a objetos</li>
        </ul>
        <p>Este conteúdo é essencial para construir uma base sólida em desenvolvimento de software.</p>
      `,
      learningObjectives: [
        "Compreender os princípios básicos de algoritmos e sua implementação",
        "Aplicar estruturas de controle para resolver problemas simples",
        "Desenvolver funções modulares para reutilização de código"
      ],
      relatedObjectives: [
        "Desenvolver habilidades para implementação de ferramentas de IA no processo de ensino",
        "Identificar as principais tecnologias de IA aplicáveis ao contexto educacional"
      ]
    },
    {
      id: 2,
      title: "Estruturas de Dados",
      description: "Organização e manipulação eficiente de dados.",
      content: `
        <p>Este módulo aborda as principais estruturas de dados utilizadas em programação:</p>
        <ul>
          <li>Arrays e listas</li>
          <li>Pilhas e filas</li>
          <li>Árvores e grafos</li>
          <li>Tabelas hash</li>
          <li>Análise de complexidade</li>
        </ul>
        <p>Compreender estruturas de dados é fundamental para desenvolver algoritmos eficientes.</p>
      `,
      learningObjectives: [
        "Selecionar estruturas de dados apropriadas para diferentes problemas",
        "Implementar e manipular estruturas de dados complexas",
        "Analisar a complexidade de tempo e espaço de algoritmos"
      ],
      relatedObjectives: [
        "Avaliar o impacto da IA na personalização da aprendizagem",
        "Criar estratégias de ensino potencializadas por sistemas de IA"
      ]
    },
    {
      id: 3,
      title: "Banco de Dados",
      description: "Modelagem e manipulação de banco de dados relacionais.",
      content: `
        <p>Neste módulo sobre bancos de dados, abordaremos:</p>
        <ul>
          <li>Modelagem de dados e normalização</li>
          <li>Linguagem SQL (queries, joins, índices)</li>
          <li>Transações e controle de concorrência</li>
          <li>Bancos NoSQL e suas características</li>
          <li>Otimização de consultas</li>
        </ul>
        <p>Ao final, você será capaz de projetar e implementar soluções eficientes de armazenamento de dados.</p>
      `,
      learningObjectives: [
        "Modelar bancos de dados relacionais utilizando normalização",
        "Desenvolver consultas SQL para manipulação e extração de dados",
        "Comparar bancos de dados relacionais e NoSQL para diferentes cenários"
      ],
      relatedObjectives: [
        "Compreender os aspectos éticos envolvidos na aplicação de IA na educação",
        "Desenvolver habilidades para implementação de ferramentas de IA no processo de ensino"
      ]
    },
    {
      id: 4,
      title: "Redes de Computadores",
      description: "Fundamentos de comunicação e protocolos de rede.",
      content: `
        <p>Este módulo explora os conceitos essenciais de redes de computadores:</p>
        <ul>
          <li>Modelo OSI e TCP/IP</li>
          <li>Protocolos de comunicação</li>
          <li>Roteamento e endereçamento IP</li>
          <li>Segurança de redes</li>
          <li>Tecnologias sem fio</li>
        </ul>
        <p>Compreender redes é fundamental para desenvolver aplicações distribuídas e serviços web.</p>
      `,
      learningObjectives: [
        "Explicar os modelos de rede e suas camadas funcionais",
        "Configurar redes básicas com roteamento e endereçamento IP",
        "Implementar protocolos de segurança em redes corporativas"
      ],
      relatedObjectives: [
        "Identificar as principais tecnologias de IA aplicáveis ao contexto educacional",
        "Avaliar o impacto da IA na personalização da aprendizagem"
      ]
    }
  ];

  return (
    <div className="content-list-container">
      <h2 className="content-list-title">Conteúdo do Plano de Ensino</h2>
      
      <div className="content-list">
        {contentItems.map(item => (
          <ContentItemComponent 
            key={item.id}
            title={item.title}
            description={item.description}
            content={item.content}
            learningObjectives={item.learningObjectives}
            relatedObjectives={item.relatedObjectives}
          />
        ))}
      </div>
      
      <div className="content-list-actions">
        <button className="content-list-back-btn" onClick={onBack}>
          Voltar
        </button>
        <button className="content-list-continue-btn" onClick={onContinue}>
          Avançar
        </button>
      </div>
    </div>
  );
};

export default ContentListComponent;