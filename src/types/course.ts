
export type ActivityType = 'Exposição' | 'Dinâmica' | 'Avaliação' | 'Prática' | 'Debate';
export type CourseFormat = 'EAD' | 'Presencial' | 'Híbrido';
export type CourseStatus = 'Rascunho' | 'Em andamento' | 'Concluído' | 'Arquivado';
export type LessonStatus = 'Fazer' | 'Fazendo' | 'Finalizando';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number;
  activityType: ActivityType;
  notes?: string;
  status: LessonStatus;
}

export interface Module {
  id: string;
  title: string;
  description?: string;
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
  status: CourseStatus;
  modules: Module[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  collaborators?: string[];
  department?: string;
  format?: CourseFormat;
}
