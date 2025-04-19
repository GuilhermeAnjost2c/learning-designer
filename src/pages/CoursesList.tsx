
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCourseStore, Course } from "@/store/courseStore";
import { useUserStore } from "@/store/userStore";
import { AddCourseButton } from "@/components/courses/AddCourseButton";
import { CourseCard } from "@/components/courses/CourseCard";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CoursesList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const { courses } = useCourseStore();
  const { currentUser, departments, hasAccessToCourse } = useUserStore();

  // Get all unique tags from all courses
  const allTags = Array.from(
    new Set(courses.flatMap((course) => course.tags))
  ).filter(Boolean);

  // Filter courses based on search term, tag, and user access
  const filteredCourses = courses.filter((course) => {
    // Check if user has access to the course (department match or invited)
    const hasAccess = hasAccessToCourse(course.id, departmentFilter === "all" ? "" : departmentFilter);
    
    if (!currentUser.isAuthenticated || !hasAccess) {
      return false;
    }
    
    // Check search term
    const matchesSearch =
      searchTerm === "" ||
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Check tag filter
    const matchesTag =
      tagFilter === "all" || course.tags.includes(tagFilter);
    
    return matchesSearch && matchesTag;
  });

  // Sort courses by update date (newest first)
  const sortedCourses = [...filteredCourses].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <div className="container py-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Cursos</h1>
        {currentUser.isAuthenticated && currentUser.role === "admin" && (
          <AddCourseButton />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cursos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={tagFilter} onValueChange={setTagFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as tags</SelectItem>
            {allTags.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select 
          value={departmentFilter} 
          onValueChange={setDepartmentFilter}
          disabled={currentUser.role === "admin"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por departamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os departamentos</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!currentUser.isAuthenticated ? (
        <div className="text-center py-10">
          <h2 className="text-xl font-medium mb-2">Login Required</h2>
          <p className="text-muted-foreground mb-4">
            Please login to view available courses.
          </p>
          <Link 
            to="/login" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Go to Login
          </Link>
        </div>
      ) : sortedCourses.length === 0 ? (
        <div className="text-center py-10">
          <h2 className="text-xl font-medium mb-2">No courses found</h2>
          <p className="text-muted-foreground">
            {searchTerm || tagFilter !== "all"
              ? "Try adjusting your search or filters."
              : "There are no courses available yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesList;
