
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
    modules: course.modules.map(module => ({
      id: module.id,
      title: module.title,
      description: module.description,
      lessons: module.lessons.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        duration: lesson.duration,
        activityType: lesson.activity_type,
        status: lesson.status,
        notes: lesson.notes || ''
      }))
    })),
    collaborators: course.collaborators || [],
    approvalRequests: course.approval_requests ? course.approval_requests.map(request => ({
      id: request.id,
      courseId: request.course_id,
      requestedBy: request.requested_by,
      approverId: request.approver_id,
      requestDate: new Date(request.request_date),
      approvalType: request.approval_type,
      itemId: request.item_id,
      status: request.status,
      comments: request.comments,
      reviewDate: request.review_date ? new Date(request.review_date) : undefined
    })) : []
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
    modules: course.modules.map(module => ({
      id: module.id,
      course_id: course.id,
      title: module.title,
      description: module.description,
      position: 0, // Default position
      lessons: module.lessons.map((lesson, index) => ({
        id: lesson.id,
        module_id: module.id,
        title: lesson.title,
        description: lesson.description,
        duration: lesson.duration,
        activity_type: lesson.activityType,
        status: lesson.status,
        position: index, // Use index as position
        notes: lesson.notes
      }))
    })),
    collaborators: course.collaborators || [],
    approval_requests: course.approvalRequests ? course.approvalRequests.map(request => ({
      id: request.id,
      course_id: request.courseId,
      request_date: request.requestDate.toISOString(),
      requested_by: request.requestedBy,
      approver_id: request.approverId,
      approval_type: request.approvalType,
      item_id: request.itemId,
      status: request.status,
      comments: request.comments,
      review_date: request.reviewDate ? request.reviewDate.toISOString() : undefined
    })) : undefined
  };
}
