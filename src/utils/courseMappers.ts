
import { Course as CourseType } from "@/types/course";
import { Course as CourseStoreType } from "@/store/courseStore";

// Function to map from database/type course model to store course model
export function mapCourseToStoreModel(course: CourseType): CourseStoreType {
  return {
    id: course.id,
    name: course.name,
    description: course.description,
    objectives: course.objectives,
    targetAudience: course.target_audience,
    estimatedDuration: course.estimated_duration,
    thumbnail: course.thumbnail,
    createdAt: new Date(course.created_at),
    updatedAt: new Date(course.updated_at),
    tags: course.tags || [],
    status: course.status,
    createdBy: course.created_by,
    department: course.department,
    format: course.format,
    modules: course.modules,
    collaborators: course.collaborators || [],
    approvalRequests: course.approval_requests
  };
}

// Function to map from store course model to database/type course model
export function mapStoreToTypeModel(course: CourseStoreType): CourseType {
  return {
    id: course.id,
    name: course.name,
    description: course.description,
    objectives: course.objectives,
    target_audience: course.targetAudience,
    estimated_duration: course.estimatedDuration,
    thumbnail: course.thumbnail,
    created_at: course.createdAt.toISOString(),
    updated_at: course.updatedAt.toISOString(),
    tags: course.tags || [],
    status: course.status,
    created_by: course.createdBy,
    department: course.department,
    format: course.format,
    modules: course.modules,
    collaborators: course.collaborators || [],
    approval_requests: course.approvalRequests
  };
}
