
import { Course, Module, Lesson, ActivityType } from "@/store/courseStore";

// Sample modules with lessons
export const sampleModules: Module[] = [
  {
    id: "m1",
    title: "Introdução ao Design Thinking",
    description: "Fundamentos do Design Thinking e sua aplicação no contexto educacional",
    lessons: [
      {
        id: "l1",
        title: "O que é Design Thinking?",
        description: "Conceitos básicos e princípios do Design Thinking.",
        duration: 60,
        activityType: "Exposição",
        notes: "Preparar exemplos práticos de aplicação do Design Thinking em contextos educacionais.",
        status: "Fazer"
      },
      {
        id: "l2",
        title: "Empatia: A Base do Design Thinking",
        description: "Técnicas e ferramentas para desenvolver empatia com os usuários.",
        duration: 90,
        activityType: "Dinâmica",
        notes: "Trazer materiais para a atividade 'Um dia na vida de...'",
        status: "Fazer"
      },
      {
        id: "l3",
        title: "Definição de Problemas",
        description: "Como identificar e definir problemas de forma clara e objetiva.",
        duration: 60,
        activityType: "Prática",
        notes: "Usar o template 'Problem Statement'.",
        status: "Fazer"
      }
    ],
  },
  {
    id: "m2",
    title: "Ferramentas de Ideação",
    description: "Técnicas para gerar ideias inovadoras",
    lessons: [
      {
        id: "l4",
        title: "Brainstorming Efetivo",
        description: "Técnicas para conduzir sessões de brainstorming produtivas.",
        duration: 60,
        activityType: "Dinâmica",
        notes: "Preparar post-its e canetas para todos os participantes.",
        status: "Fazer"
      },
      {
        id: "l5",
        title: "Pensamento Lateral",
        description: "Como desenvolver o pensamento lateral para resolver problemas complexos.",
        duration: 90,
        activityType: "Exposição",
        notes: "Referenciar o livro 'Pensamento Lateral' de Edward de Bono.",
        status: "Fazer"
      },
      {
        id: "l6",
        title: "Prototipagem Rápida",
        description: "Técnicas para criar protótipos rápidos e eficientes.",
        duration: 120,
        activityType: "Prática",
        notes: "Trazer materiais diversos para construção de protótipos (papel, cartolina, cola, etc).",
        status: "Fazer"
      }
    ],
  },
  {
    id: "m3",
    title: "Implementação e Testes",
    description: "Estratégias para implementar e testar soluções",
    lessons: [
      {
        id: "l7",
        title: "Testes com Usuários",
        description: "Como planejar e conduzir testes de usabilidade eficazes.",
        duration: 90,
        activityType: "Exposição",
        notes: "Criar roteiro de testes com usuários.",
        status: "Fazer"
      },
      {
        id: "l8",
        title: "Métricas de Sucesso",
        description: "Como definir e mensurar o sucesso de uma solução.",
        duration: 60,
        activityType: "Exposição",
        notes: "Desenvolver exemplos de métricas para diferentes tipos de projetos.",
        status: "Fazer"
      },
      {
        id: "l9",
        title: "Iteração e Melhoria Contínua",
        description: "Estratégias para iterar e melhorar soluções com base no feedback dos usuários.",
        duration: 90,
        activityType: "Prática",
        notes: "Trazer exemplos de projetos que passaram por várias iterações.",
        status: "Fazer"
      },
      {
        id: "l10",
        title: "Apresentação Final",
        description: "Técnicas para apresentar soluções de design thinking de forma eficaz.",
        duration: 120,
        activityType: "Avaliação",
        notes: "Os participantes apresentarão suas soluções para um problema real.",
        status: "Fazer"
      }
    ],
  },
];

// Sample courses with modules
export const sampleCourses: Course[] = [
  {
    id: "c1",
    name: "Design Thinking para Educadores",
    description: "Este curso introduz educadores ao processo de Design Thinking, fornecendo ferramentas e técnicas para aplicar essa abordagem centrada no ser humano para resolver problemas complexos no ambiente educacional.",
    objectives: "Ao final deste curso, os participantes serão capazes de:\n- Compreender os princípios do Design Thinking\n- Aplicar o processo de Design Thinking para resolver problemas educacionais\n- Utilizar ferramentas de empatia, ideação e prototipagem\n- Implementar e testar soluções inovadoras",
    targetAudience: "Professores, coordenadores e gestores educacionais",
    estimatedDuration: 840, // em minutos (14 horas)
    thumbnail: "/placeholder.svg",
    modules: sampleModules,
    createdAt: new Date("2025-02-15"),
    updatedAt: new Date("2025-03-10"),
    tags: ["Design Thinking", "Inovação", "Educação"],
    status: "Em andamento"
  },
  {
    id: "c2",
    name: "Aprendizagem Baseada em Projetos",
    description: "Este curso explora a metodologia de Aprendizagem Baseada em Projetos (PBL), fornecendo estratégias para implementar projetos significativos que promovam o desenvolvimento de habilidades do século XXI.",
    objectives: "Ao final deste curso, os participantes serão capazes de:\n- Compreender os princípios da Aprendizagem Baseada em Projetos\n- Planejar projetos significativos alinhados com objetivos curriculares\n- Facilitar o processo de aprendizagem durante os projetos\n- Avaliar o desenvolvimento de habilidades e competências através de projetos",
    targetAudience: "Professores do ensino fundamental e médio",
    estimatedDuration: 960, // em minutos (16 horas)
    thumbnail: "/placeholder.svg",
    modules: [
      {
        id: "m4",
        title: "Fundamentos da PBL",
        description: "Princípios e benefícios da Aprendizagem Baseada em Projetos",
        lessons: [
          {
            id: "l11",
            title: "O que é PBL?",
            description: "Introdução aos conceitos e princípios da Aprendizagem Baseada em Projetos.",
            duration: 60,
            activityType: "Exposição",
            notes: "Preparar estudos de caso de implementação bem-sucedida de PBL.",
            status: "Fazer"
          },
          {
            id: "l12",
            title: "Benefícios e Desafios da PBL",
            description: "Análise dos benefícios e desafios da implementação da PBL.",
            duration: 90,
            activityType: "Dinâmica",
            notes: "Organizar debate sobre prós e contras da PBL.",
            status: "Fazer"
          },
          {
            id: "l13",
            title: "PBL vs. Métodos Tradicionais",
            description: "Comparação entre PBL e abordagens pedagógicas tradicionais.",
            duration: 60,
            activityType: "Exposição",
            notes: "Criar tabela comparativa entre métodos tradicionais e PBL.",
            status: "Fazer"
          }
        ],
      },
      {
        id: "m5",
        title: "Planejamento de Projetos",
        description: "Estratégias para planejar projetos significativos",
        lessons: [
          {
            id: "l14",
            title: "Definição de Questões Norteadoras",
            description: "Como criar questões norteadoras eficazes para projetos.",
            duration: 90,
            activityType: "Prática",
            notes: "Desenvolver exemplos de questões norteadoras para diferentes disciplinas.",
            status: "Fazer"
          },
          {
            id: "l15",
            title: "Alinhamento Curricular",
            description: "Estratégias para alinhar projetos com objetivos curriculares.",
            duration: 60,
            activityType: "Exposição",
            notes: "Trazer exemplos de matrizes de alinhamento curricular.",
            status: "Fazer"
          },
          {
            id: "l16",
            title: "Recursos e Materiais",
            description: "Identificação e organização de recursos para projetos.",
            duration: 60,
            activityType: "Prática",
            notes: "Criar lista de verificação para planejamento de recursos.",
            status: "Fazer"
          },
          {
            id: "l17",
            title: "Cronograma e Marcos",
            description: "Como planejar o cronograma e definir marcos para projetos.",
            duration: 90,
            activityType: "Prática",
            notes: "Desenvolver template de cronograma para projetos.",
            status: "Fazer"
          }
        ],
      },
    ],
    createdAt: new Date("2025-01-20"),
    updatedAt: new Date("2025-02-05"),
    tags: ["Metodologias Ativas", "Projetos", "Aprendizagem"],
    status: "Rascunho"
  },
];
