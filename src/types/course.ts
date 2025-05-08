
export type ActivityType = "Exposição" | "Dinâmica" | "Avaliação" | "Prática" | "Debate";
export type CourseFormat = "EAD" | "Ao vivo" | "Híbrido";
export type CourseStatus = "Rascunho" | "Em andamento" | "Concluído" | "Arquivado";
export type LessonStatus = "Fazer" | "Fazendo" | "Finalizando";
export type ApprovalStatus = "Pendente" | "Aprovado" | "Rejeitado";
export type ApprovalItemType = "curso_completo" | "estrutura" | "modulo" | "aula";
export type DepartmentName = 'Marketing' | 'Vendas' | 'RH' | 'TI' | 'Operações';

export interface Course {
  id: string;
  name: string;
  description: string;
  objectives: string;
  target_audience: string;
  estimated_duration: number;
  thumbnail?: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  status: CourseStatus;
  created_by: string;
  department?: string;
  format?: CourseFormat;
  modules: Module[];
  collaborators: string[];
  approval_requests?: ApprovalRequest[];
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  position: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string;
  duration: number;
  activity_type: ActivityType;
  notes?: string;
  status: LessonStatus;
  position: number;
}

export interface ApprovalRequest {
  id: string;
  course_id: string;
  request_date: string;
  requested_by: string;
  approver_id: string;
  approval_type: ApprovalItemType;
  item_id?: string;
  status: ApprovalStatus;
  comments?: string;
  review_date?: string;
}

// Remove the conflicting export statement at the bottom
// The type is already exported properly at the top of the file
