
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
  status: string;
  created_by: string;
  department?: string;
  format?: "EAD" | "Ao vivo" | "Híbrido";
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
  activity_type: string;
  notes?: string;
  status: string;
  position: number;
}

export interface ApprovalRequest {
  id: string;
  course_id: string;
  request_date: string;
  requested_by: string;
  approver_id: string;
  approval_type: string;
  item_id?: string;
  status: string;
  comments?: string;
  review_date?: string;
}
