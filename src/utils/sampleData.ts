
import { Course, Module, Lesson } from "@/store/courseStore";

// Add the missing admin ID to be used as createdBy
const ADMIN_ID = 'admin-1';

export const sampleCourses: Partial<Course>[] = [
  {
    id: "course-1",
    name: "Introdução ao Design Thinking",
    description: "Um curso introdutório sobre Design Thinking para equipes corporativas. Aprenda a usar metodologias de design para resolver problemas complexos e criar soluções inovadoras centradas no usuário.",
    objectives: "Ao final deste curso, os participantes compreenderão os princípios básicos do Design Thinking e serão capazes de aplicar as etapas do processo na resolução de problemas do dia a dia.",
    targetAudience: "Gerentes, líderes de equipe e profissionais de todas as áreas interessados em metodologias de inovação.",
    estimatedDuration: 240, // 4 horas
    thumbnail: "https://images.pexels.com/photos/6444/pencil-typography-black-design.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    modules: [
      {
        id: "module-1-1",
        title: "Conceitos Básicos de Design Thinking",
        description: "Introdução aos princípios e fundamentos do Design Thinking",
        lessons: [
          {
            id: "lesson-1-1-1",
            title: "O que é Design Thinking",
            description: "Definição, história e evolução do Design Thinking como metodologia",
            duration: 20,
            activityType: "Exposição",
            status: "Finalizando"
          },
          {
            id: "lesson-1-1-2",
            title: "Os 5 Passos do Design Thinking",
            description: "Empatia, Definição, Ideação, Prototipação e Testagem",
            duration: 40,
            activityType: "Dinâmica",
            status: "Fazendo"
          }
        ]
      },
      {
        id: "module-1-2",
        title: "Aplicação Prática",
        description: "Como aplicar Design Thinking em projetos reais",
        lessons: [
          {
            id: "lesson-1-2-1",
            title: "Estudo de Caso: Design Thinking na Prática",
            description: "Análise de casos reais de aplicação do Design Thinking",
            duration: 60,
            activityType: "Prática",
            status: "Fazer"
          }
        ]
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ["Inovação", "Design", "Metodologias"],
    status: "Em andamento",
    createdBy: ADMIN_ID,
    collaborators: []
  },
  {
    id: "course-2",
    name: "Liderança para Novos Gestores",
    description: "Este curso apresenta conceitos e práticas essenciais para profissionais que estão assumindo posições de liderança pela primeira vez ou que desejam se preparar para esse desafio.",
    objectives: "Desenvolver competências fundamentais de liderança, incluindo comunicação eficaz, delegação, feedback, gestão de conflitos e desenvolvimento de equipes.",
    targetAudience: "Novos gestores, líderes de equipe e profissionais que aspiram a posições de liderança.",
    estimatedDuration: 360, // 6 horas
    thumbnail: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    modules: [
      {
        id: "module-2-1",
        title: "Fundamentos da Liderança",
        description: "Conceitos básicos e estilos de liderança",
        lessons: [
          {
            id: "lesson-2-1-1",
            title: "O Papel do Líder",
            description: "Compreendendo as responsabilidades e desafios da liderança",
            duration: 45,
            activityType: "Exposição",
            status: "Fazer"
          },
          {
            id: "lesson-2-1-2",
            title: "Estilos de Liderança",
            description: "Conhecendo diferentes abordagens de liderança e quando aplicá-las",
            duration: 45,
            activityType: "Dinâmica",
            status: "Fazer"
          }
        ]
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ["Liderança", "Gestão", "Desenvolvimento Profissional"],
    status: "Rascunho",
    createdBy: ADMIN_ID,
    collaborators: []
  }
];
