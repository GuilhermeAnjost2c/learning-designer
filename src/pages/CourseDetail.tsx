import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCourseStore, Module, Lesson } from "@/store/courseStore";
import { useUserStore } from "@/store/userStore";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModuleItem } from "@/components/courses/ModuleItem";
import { ModuleForm } from "@/components/courses/ModuleForm";
import CourseUsers from "@/components/courses/CourseUsers";
import { Edit, Trash2, Clock, Users, Building } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [addModuleOpen, setAddModuleOpen] = useState(false);
  const [departmentDialogOpen, setDepartmentDialogOpen] = useState(false);
  const { courses, deleteModule, updateCourse } = useCourseStore();
  const { currentUser, departments, hasAccessToCourse } = useUserStore();
  const isAdmin = currentUser.role === "admin";

  const course = courses.find((c) => c.id === courseId);

  useEffect(() => {
    if (courseId && course) {
      const hasAccess = hasAccessToCourse(course.id, course.targetAudience);
      
      if (!currentUser.isAuthenticated || !hasAccess) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to view this course",
          variant: "destructive",
        });
        navigate("/courses");
      }
    } else if (courseId) {
      toast({
        title: "Course not found",
        description: "The course you're looking for doesn't exist",
        variant: "destructive",
      });
      navigate("/courses");
    }
  }, [courseId, course, currentUser, navigate, toast, hasAccessToCourse]);

  if (!course) {
    return (
      <div className="container py-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Course not found</h2>
          <Button onClick={() => navigate("/courses")}>Back to Courses</Button>
        </div>
      </div>
    );
  }

  const handleDeleteCourse = () => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      useCourseStore.getState().deleteCourse(course.id);
      navigate("/courses");
      toast({
        title: "Course deleted",
        description: "The course has been permanently deleted",
      });
    }
  };

  const handleDeleteModule = (moduleId: string) => {
    if (window.confirm("Are you sure you want to delete this module?")) {
      deleteModule(course.id, moduleId);
      toast({
        title: "Module deleted",
        description: "The module has been deleted",
      });
    }
  };

  const handleDepartmentChange = (department: string) => {
    updateCourse(course.id, { targetAudience: department });
    setDepartmentDialogOpen(false);
    toast({
      title: "Department updated",
      description: `Course department changed to ${department}`,
    });
  };

  const totalLessons = course.modules.reduce(
    (count, module) => count + module.lessons.length,
    0
  );

  const totalDuration = course.modules.reduce((total, module) => {
    return (
      total +
      module.lessons.reduce((moduleTotal, lesson) => {
        return moduleTotal + lesson.duration;
      }, 0)
    );
  }, 0);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? `${hours}h ` : ""}${mins > 0 ? `${mins}m` : ""}`;
  };

  return (
    <div className="container py-8 animate-fade-in">
      <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">{course.name}</h1>
          <div className="flex items-center text-sm text-muted-foreground mt-2 space-x-4">
            <div className="flex items-center">
              <Clock className="mr-1 w-4 h-4" />
              {formatDuration(totalDuration)}
            </div>
            <div className="flex items-center">
              <Building className="mr-1 w-4 h-4" />
              {course.targetAudience}
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="flex space-x-2">
            <Dialog open={departmentDialogOpen} onOpenChange={setDepartmentDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Building className="mr-2 h-4 w-4" />
                  Change Department
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Department</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Select
                      value={course.targetAudience}
                      onValueChange={handleDepartmentChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button
              variant="outline"
              onClick={() => navigate(`/courses/edit/${course.id}`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Course
            </Button>
            <Button variant="destructive" onClick={handleDeleteCourse}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{course.description}</p>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Learning Objectives</h3>
                <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                  {course.objectives}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Target Audience</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {course.targetAudience}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Duration</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatDuration(totalDuration)}
                </p>
              </div>
              <div>
                <h3 className="font-medium">Content</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {course.modules.length} modules, {totalLessons} lessons
                </p>
              </div>
              {course.tags && course.tags.length > 0 && (
                <div>
                  <h3 className="font-medium">Tags</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {course.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {isAdmin && (
            <CourseUsers 
              courseId={course.id} 
              courseDepartment={course.targetAudience} 
            />
          )}
        </div>
      </div>

      <Tabs defaultValue="content" className="mt-6">
        <TabsList>
          <TabsTrigger value="content">Course Content</TabsTrigger>
        </TabsList>
        <TabsContent value="content" className="mt-6">
          <div className="space-y-6">
            {course.modules.length === 0 ? (
              <div className="text-center py-12 border rounded-lg">
                <h3 className="text-lg font-medium mb-2">No modules yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by adding your first module to this course.
                </p>
                {isAdmin && (
                  <Button onClick={() => setAddModuleOpen(true)}>
                    Add Module
                  </Button>
                )}
              </div>
            ) : (
              <>
                {course.modules.map((module, index) => (
                  <ModuleItem
                    key={module.id}
                    module={module}
                    index={index}
                    courseId={course.id}
                    onDelete={() => handleDeleteModule(module.id)}
                    readOnly={!isAdmin}
                  />
                ))}
                {isAdmin && (
                  <div className="mt-6">
                    <Button
                      onClick={() => setAddModuleOpen(true)}
                      className="w-full py-6"
                      variant="outline"
                    >
                      + Add Module
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={addModuleOpen} onOpenChange={setAddModuleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Module</DialogTitle>
          </DialogHeader>
          <ModuleForm
            courseId={course.id}
            onClose={() => setAddModuleOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseDetail;
