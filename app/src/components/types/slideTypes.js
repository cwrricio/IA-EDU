/**
 * @typedef {Object} TextoSlideContent
 * @property {string} titulo - Título do slide
 * @property {string} texto - Texto do conteúdo
 * @property {string} [logoUrl] - URL da logo (opcional)
 */

/**
 * @typedef {Object} TopicoSlideContent
 * @property {string} titulo - Título do slide
 * @property {string[]} topicos - Lista de tópicos
 * @property {string} [logoUrl] - URL da logo (opcional)
 */

/**
 * @typedef {Object} Pergunta
 * @property {string} pergunta - Texto da pergunta
 * @property {string[]} opcoes - Lista de opções de resposta
 * @property {number} respostaCorreta - Índice da resposta correta
 */

/**
 * @typedef {Object} QuizSlideContent
 * @property {Pergunta[]} perguntas - Lista de perguntas
 * @property {string} [logoUrl] - URL da logo (opcional)
 */

/**
 * @typedef {Object} ConclusaoSlideContent
 * @property {string} [titulo] - Título personalizado (opcional)
 * @property {string} [subtitulo] - Subtítulo personalizado (opcional)
 * @property {string} [logoUrl] - URL da logo (opcional)
 */

/**
 * @typedef {Object} Slide
 * @property {'texto'|'topicos'|'quiz'|'conclusao'} tipo - Tipo do slide
 * @property {TextoSlideContent|TopicoSlideContent|QuizSlideContent|ConclusaoSlideContent} conteudo - Conteúdo do slide
 */

/**
 * @typedef {Object} Modulo
 * @property {string} id - Identificador único do módulo
 * @property {string} titulo - Título do módulo
 * @property {Slide[]} slides - Lista de slides do módulo
 */

/**
 * @typedef {Object} Trilha
 * @property {string} id - Identificador único da trilha
 * @property {string} nome - Nome da trilha
 * @property {string} descricao - Descrição da trilha
 * @property {Modulo[]} modulos - Lista de módulos da trilha
 */

export {};
