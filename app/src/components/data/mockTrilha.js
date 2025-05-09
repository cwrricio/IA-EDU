/**
 * Dados mockados para uma trilha de exemplo
 */
export const mockTrilha = [
  {
    id: 1,
    titulo: "Introdução à IA na Educação",
    slides: [
      {
        tipo: "texto",
        titulo: "Bem-vindo ao curso de IA na Educação",
        conteudo:
          "Neste curso, você aprenderá sobre os conceitos fundamentais de Inteligência Artificial e como eles podem ser aplicados no contexto educacional para melhorar a experiência de aprendizado dos estudantes.",
      },
      {
        tipo: "topicos",
        titulo: "O que você aprenderá",
        topicos: [
          "Conceitos básicos de Inteligência Artificial",
          "Como a IA está transformando a educação",
          "Ferramentas de IA para personalização do aprendizado",
          "Aspectos éticos da IA na educação",
        ],
      },
      {
        tipo: "quiz",
        titulo: "Avaliação de Conhecimento",
        // As perguntas são definidas dentro do componente QuizSlide
      },
      {
        tipo: "conclusao",
        titulo: "Parabéns!",
        mensagem: "Você concluiu o módulo de introdução à IA na Educação.",
      },
    ],
  },
  // Mais trilhas podem ser adicionadas aqui
];
