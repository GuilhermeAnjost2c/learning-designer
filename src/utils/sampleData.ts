
import { nanoid } from "nanoid";
import { Course, Module, Lesson, CourseStatus } from "@/store/courseStore";

const designThinkingModule: Module = {
  id: nanoid(7),
  title: "Introdução ao Design Thinking",
  description: "Fundamentos e princípios do Design Thinking",
  lessons: [
    {
      id: nanoid(7),
      title: "O que é Design Thinking",
      description: "Compreendendo a abordagem centrada no usuário",
      duration: 45,
      activityType: "Exposição",
      status: "Finalizando",
      notes: "Preparar exemplos práticos de empresas que utilizam Design Thinking"
    },
    {
      id: nanoid(7),
      title: "As 5 etapas do Design Thinking",
      description: "Empatia, Definição, Ideação, Prototipação e Testes",
      duration: 60,
      activityType: "Dinâmica",
      status: "Fazendo",
      notes: "Organizar atividade prática para cada etapa"
    }
  ]
};

const uxResearchModule: Module = {
  id: nanoid(7),
  title: "Pesquisa com Usuários",
  description: "Metodologias e técnicas para pesquisa com usuários",
  lessons: [
    {
      id: nanoid(7),
      title: "Métodos de entrevista",
      description: "Como conduzir entrevistas eficazes com usuários",
      duration: 90,
      activityType: "Exposição",
      status: "Fazendo",
      notes: "Preparar roteiros de entrevista como exemplo"
    },
    {
      id: nanoid(7),
      title: "Testes de usabilidade",
      description: "Planejamento e execução de testes de usabilidade",
      duration: 120,
      activityType: "Avaliação",
      status: "Fazer",
      notes: "Demonstrar ferramentas de teste remoto"
    }
  ]
};

const agileMangamentModule: Module = {
  id: nanoid(7),
  title: "Gestão Ágil",
  description: "Princípios e práticas ágeis para gestão de projetos",
  lessons: [
    {
      id: nanoid(7),
      title: "Fundamentos do Scrum",
      description: "Papéis, artefatos e cerimônias do Scrum",
      duration: 60,
      activityType: "Exposição",
      status: "Fazer",
      notes: "Preparar exemplos práticos de aplicação do Scrum"
    },
    {
      id: nanoid(7),
      title: "Kanban na prática",
      description: "Implementação e gestão de quadros Kanban",
      duration: 45,
      activityType: "Dinâmica",
      status: "Fazer",
      notes: "Preparar exercício prático com ferramentas online de Kanban"
    }
  ]
};

export const sampleCourses: Course[] = [
  {
    id: nanoid(7),
    name: "Design Thinking: Inovação na Prática",
    description:
      "Um curso completo sobre Design Thinking e sua aplicação em projetos reais de inovação.",
    objectives:
      "Ao final deste curso, os participantes serão capazes de aplicar o processo de Design Thinking para resolver problemas complexos, criar soluções inovadoras centradas no usuário e implementar protótipos para validação de ideias.",
    targetAudience:
      "Profissionais de design, gestores de produto, líderes de equipes de inovação e qualquer pessoa interessada em metodologias para resolução criativa de problemas.",
    estimatedDuration: 1200,
    thumbnail:
      "https://images.unsplash.com/photo-1544928147-79a2dbc1f669?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZGVzaWduJTIwdGhpbmtpbmd8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60",
    createdAt: new Date(2023, 1, 15),
    updatedAt: new Date(2023, 3, 10),
    tags: ["design", "inovação", "ux", "criatividade"],
    status: "Em andamento",
    createdBy: "user1",
    department: "Design",
    modules: [designThinkingModule, uxResearchModule],
    collaborators: ["user3", "user5"],
    format: "EAD"
  },
  {
    id: nanoid(7),
    name: "Gestão de Projetos Ágeis",
    description:
      "Aprenda a gerenciar projetos utilizando metodologias ágeis como Scrum, Kanban e XP.",
    objectives:
      "Este curso capacitará os participantes a planejar, executar e monitorar projetos utilizando frameworks ágeis, promovendo maior produtividade, transparência e capacidade de adaptação a mudanças.",
    targetAudience:
      "Gerentes de projeto, líderes de equipe, Scrum Masters, Product Owners e profissionais que desejam se aprofundar em métodos ágeis.",
    estimatedDuration: 960,
    thumbnail:
      "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YWdpbGV8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60",
    createdAt: new Date(2023, 0, 20),
    updatedAt: new Date(2023, 2, 5),
    tags: ["agile", "scrum", "kanban", "gestão", "projetos"],
    status: "Concluído",
    createdBy: "user2",
    department: "Tecnologia",
    modules: [agileMangamentModule],
    collaborators: [],
    format: "Ao vivo"
  },
];

// Sample users
export const sampleUsers = [
  {
    id: "user1",
    name: "Ana Silva",
    email: "ana.silva@empresa.com",
    role: "admin",
    department: "Design",
    createdAt: new Date(2022, 0, 10),
  },
  {
    id: "user2",
    name: "Carlos Santos",
    email: "carlos.santos@empresa.com",
    role: "instructor",
    department: "Tecnologia",
    createdAt: new Date(2022, 1, 15),
  },
  {
    id: "user3",
    name: "Maria Oliveira",
    email: "maria.oliveira@empresa.com",
    role: "instructor",
    department: "RH",
    createdAt: new Date(2022, 2, 20),
  },
  {
    id: "user4",
    name: "João Pereira",
    email: "joao.pereira@empresa.com",
    role: "student",
    department: "Marketing",
    createdAt: new Date(2022, 3, 5),
  },
  {
    id: "user5",
    name: "Luísa Costa",
    email: "luisa.costa@empresa.com",
    role: "manager",
    department: "Design",
    createdAt: new Date(2022, 4, 12),
  },
];

export const sampleApprovals = [
  {
    id: nanoid(7),
    courseId: "eka5bwa",
    requestedBy: "user2",
    approverId: "user5",
    requestDate: new Date(2023, 5, 10),
    approvalType: "curso_completo",
    status: "Pendente",
    comments: "Por favor, revise este curso e verifique se está de acordo com os padrões."
  },
  {
    id: nanoid(7),
    courseId: "4Ab23df",
    requestedBy: "user3",
    approverId: "user1",
    requestDate: new Date(2023, 4, 15),
    approvalType: "modulo",
    itemId: "mod123",
    status: "Aprovado",
    comments: "Módulo aprovado sem ressalvas."
  }
];
