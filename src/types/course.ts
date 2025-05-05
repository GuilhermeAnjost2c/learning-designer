
export type ActivityType = 'Exposição' | 'Dinâmica' | 'Avaliação' | 'Prática' | 'Debate';

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  duration: number;
  activityType: ActivityType;
  notes?: string;
  status: 'Fazer' | 'Em Progresso' | 'Concluído';
  position: number;
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  position: number;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  name: string;
  description: string;
  objectives: string;
  targetAudience: string;
  estimatedDuration: number;
  thumbnail?: string;
  status: 'Rascunho' | 'Revisão' | 'Publicado';
  modules: Module[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  collaborators?: string[];
  department?: string;
  format?: string;
}
