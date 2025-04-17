import { Course, ActivityType } from "@/store/courseStore";

// Gera um ID aleatório
const generateId = () => Math.random().toString(36).substring(2, 9);

// Gera uma data aleatória nos últimos 30 dias
const generateRandomDate = (days = 30) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * days));
  return date;
};

// Curso de exemplo: Design Thinking
export const designThinkingCourse: Course = {
  id: generateId(),
  name: "Design Thinking para Inovação",
  description: "Este curso aborda os princípios fundamentais do Design Thinking como metodologia para resolução de problemas complexos e geração de soluções inovadoras centradas no usuário.",
  objectives: "• Compreender os princípios do Design Thinking\n• Aplicar as etapas do processo de Design Thinking em projetos reais\n• Desenvolver empatia com os usuários\n• Criar protótipos de baixa fidelidade para validação de ideias\n• Conduzir testes de usabilidade",
  targetAudience: "Profissionais de UX/UI, Gestores de Produto, Empreendedores e qualquer pessoa interessada em metodologias de inovação",
  estimatedDuration: 480,
  thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2670&auto=format&fit=crop",
  tags: ["design", "inovação", "metodologias"],
  modules: [
    {
      id: generateId(),
      title: "Fundamentos do Design Thinking",
      description: "Introdução aos conceitos fundamentais e mindset do Design Thinking",
      lessons: [
        {
          id: generateId(),
          title: "O que é Design Thinking?",
          description: "Definição, origem e princípios fundamentais",
          duration: 45,
          activityType: "Exposição" as ActivityType,
          notes: "Apresentar estudos de caso de empresas como IDEO, Apple e Google"
        },
        {
          id: generateId(),
          title: "Mindset do Design Thinker",
          description: "Características e habilidades essenciais",
          duration: 30,
          activityType: "Dinâmica" as ActivityType,
          notes: "Dinâmica: 'Meu perfil de Design Thinker'"
        },
        {
          id: generateId(),
          title: "Exploração de Cases",
          description: "Análise de casos de sucesso de aplicação do Design Thinking",
          duration: 60,
          activityType: "Prática" as ActivityType,
          notes: "Trazer exemplos de aplicação em diferentes contextos: produtos, serviços e processos"
        }
      ]
    },
    {
      id: generateId(),
      title: "Etapa de Empatia",
      description: "Técnicas para entendimento profundo das necessidades dos usuários",
      lessons: [
        {
          id: generateId(),
          title: "Introdução à pesquisa com usuários",
          description: "Métodos e abordagens para coleta de insights",
          duration: 45,
          activityType: "Exposição" as ActivityType,
          notes: "Apresentar diferentes tipos de entrevistas e observação"
        },
        {
          id: generateId(),
          title: "Criação de personas",
          description: "Como desenvolver perfis representativos dos usuários",
          duration: 90,
          activityType: "Prática" as ActivityType,
          notes: "Materiais: Modelos de persona, post-its, canetas coloridas"
        },
        {
          id: generateId(),
          title: "Mapa de Empatia",
          description: "Ferramenta para visualizar necessidades e desejos dos usuários",
          duration: 60,
          activityType: "Prática" as ActivityType,
          notes: "Exercício em grupos de 4 pessoas"
        }
      ]
    },
    {
      id: generateId(),
      title: "Ideação e Prototipação",
      description: "Técnicas para geração de ideias e criação de protótipos",
      lessons: [
        {
          id: generateId(),
          title: "Brainstorming e técnicas de ideação",
          description: "Métodos para gerar grande quantidade de ideias",
          duration: 60,
          activityType: "Dinâmica" as ActivityType,
          notes: "Dinâmicas: Crazy 8s, Brainwriting, SCAMPER"
        },
        {
          id: generateId(),
          title: "Seleção e refinamento de ideias",
          description: "Critérios e métodos para priorização",
          duration: 45,
          activityType: "Prática" as ActivityType,
          notes: "Utilizar matriz de priorização"
        },
        {
          id: generateId(),
          title: "Prototipação rápida",
          description: "Técnicas para criar protótipos de baixa fidelidade",
          duration: 120,
          activityType: "Prática" as ActivityType,
          notes: "Materiais: papel, canetas, material de escritório diverso"
        },
        {
          id: generateId(),
          title: "Teste de protótipos",
          description: "Como validar ideias com usuários reais",
          duration: 90,
          activityType: "Prática" as ActivityType,
          notes: "Simulação de testes com outros participantes"
        }
      ]
    }
  ],
  createdAt: generateRandomDate(60),
  updatedAt: generateRandomDate(10)
};

// Curso de exemplo: Gestão de Projetos Ágil
export const agileCourse: Course = {
  id: generateId(),
  name: "Gestão de Projetos Ágil com Scrum",
  description: "Este curso apresenta os fundamentos da metodologia ágil Scrum para gestão de projetos, oferecendo ferramentas práticas para implementação em equipes de diferentes tamanhos e contextos.",
  objectives: "• Compreender os valores e princípios ágeis\n• Dominar os elementos fundamentais do framework Scrum\n• Aplicar as cerimônias e artefatos do Scrum\n• Implementar métricas de acompanhamento\n• Adaptar o framework para diferentes contextos",
  targetAudience: "Gerentes de Projeto, Product Owners, Scrum Masters, membros de equipe de desenvolvimento e interessados em metodologias ágeis",
  estimatedDuration: 420,
  thumbnail: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=2670&auto=format&fit=crop",
  tags: ["agile", "scrum", "gestão de projetos"],
  modules: [
    {
      id: generateId(),
      title: "Fundamentos do Pensamento Ágil",
      description: "Introdução à mentalidade e valores ágeis",
      lessons: [
        {
          id: generateId(),
          title: "Do cascata ao ágil",
          description: "Evolução das metodologias de gestão de projetos",
          duration: 40,
          activityType: "Exposição" as ActivityType,
          notes: "Abordar as limitações do modelo waterfall"
        },
        {
          id: generateId(),
          title: "Manifesto Ágil",
          description: "Valores e princípios que fundamentam as metodologias ágeis",
          duration: 30,
          activityType: "Exposição" as ActivityType,
          notes: "Discutir exemplos práticos de cada valor"
        },
        {
          id: generateId(),
          title: "Dinâmica: Desafio da Torre",
          description: "Comparação prática entre abordagem tradicional e ágil",
          duration: 60,
          activityType: "Dinâmica" as ActivityType,
          notes: "Materiais: espaguete, marshmallow, fita adesiva"
        }
      ]
    },
    {
      id: generateId(),
      title: "Framework Scrum",
      description: "Estrutura, papéis e responsabilidades no Scrum",
      lessons: [
        {
          id: generateId(),
          title: "Papéis no Scrum",
          description: "Product Owner, Scrum Master e Time de Desenvolvimento",
          duration: 60,
          activityType: "Exposição" as ActivityType,
          notes: "Utilizar dinâmica de role-play para fixação"
        },
        {
          id: generateId(),
          title: "Eventos do Scrum",
          description: "Sprint, Planning, Daily, Review e Retrospectiva",
          duration: 90,
          activityType: "Exposição" as ActivityType,
          notes: "Demonstrar como cada evento contribui para o framework"
        },
        {
          id: generateId(),
          title: "Artefatos do Scrum",
          description: "Product Backlog, Sprint Backlog e Incremento",
          duration: 60,
          activityType: "Prática" as ActivityType,
          notes: "Exercício: Criar um Product Backlog para um projeto exemplo"
        },
        {
          id: generateId(),
          title: "Simulação de uma Sprint",
          description: "Aplicação prática do Scrum em um projeto simulado",
          duration: 120,
          activityType: "Prática" as ActivityType,
          notes: "Dividir a turma em equipes de 5-7 pessoas"
        }
      ]
    }
  ],
  createdAt: generateRandomDate(45),
  updatedAt: generateRandomDate(5)
};

// Lista de cursos de exemplo
export const sampleCourses: Course[] = [
  designThinkingCourse,
  agileCourse
];
