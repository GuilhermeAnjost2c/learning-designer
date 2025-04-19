
import { useState } from "react";
import { useUserStore, User } from "@/store/userStore";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Users, UserPlus, UserX, SearchIcon } from "lucide-react";

interface CourseUsersProps {
  courseId: string;
  courseDepartment: string;
}

const CourseUsers = ({ courseId, courseDepartment }: CourseUsersProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const { 
    users, 
    getUsersWithAccessToCourse, 
    inviteUserToCourse, 
    removeUserFromCourse,
    currentUser
  } = useUserStore();
  
  const { toast } = useToast();
  const isAdmin = currentUser.role === 'admin';
  
  // Users who have access to the course
  const accessUsers = getUsersWithAccessToCourse(courseId, courseDepartment);
  
  // Users who don't have access yet
  const otherUsers = users.filter(
    user => !accessUsers.some(u => u.id === user.id)
  );
  
  // Filter other users by search term
  const filteredOtherUsers = otherUsers.filter(
    user => searchTerm === "" || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleInviteUser = (user: User) => {
    inviteUserToCourse(user.id, courseId);
    toast({
      title: "User invited",
      description: `${user.name} has been invited to this course`,
    });
  };
  
  const handleRemoveUser = (user: User) => {
    if (user.department === courseDepartment) {
      toast({
        title: "Cannot remove user",
        description: `${user.name} belongs to the department that has access to this course`,
        variant: "destructive",
      });
      return;
    }
    
    removeUserFromCourse(user.id, courseId);
    toast({
      title: "User removed",
      description: `${user.name} has been removed from this course`,
    });
  };
  
  // If not admin, don't allow access to this component
  if (!isAdmin) return null;
  
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full mb-4">
            <Users className="mr-2 h-4 w-4" />
            Manage Course Access
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>Manage Course Access</DialogTitle>
          </DialogHeader>
          
          <div className="mt-4 space-y-6">
            <div>
              <h3 className="font-medium mb-2">Department Access</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Users from the <strong>{courseDepartment}</strong> department have automatic access to this course.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Users with Access</h3>
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accessUsers.length > 0 ? (
                      accessUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            {user.department === courseDepartment ? (
                              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                                {user.department}
                              </span>
                            ) : (
                              user.department
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveUser(user)}
                              disabled={user.department === courseDepartment || user.role === "admin"}
                            >
                              <UserX className="h-4 w-4 mr-1" />
                              Remove
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          No users have access yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Invite Users</h3>
              <div className="relative mb-2">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOtherUsers.length > 0 ? (
                      filteredOtherUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.department}</TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleInviteUser(user)}
                            >
                              <UserPlus className="h-4 w-4 mr-1" />
                              Invite
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          No other users to invite
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseUsers;
