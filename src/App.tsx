
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "./components/ui/toaster";
import { Layout } from "./components/layout/Layout";
import CourseDetail from "./pages/CourseDetail";
import CoursesList from "./pages/CoursesList";
import CreateCourse from "./pages/CreateCourse";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import DynamicsBank from "./pages/DynamicsBank";
import EduAI from "./pages/EduAI";
import Users from "./pages/Users";
import Login from "./pages/Login";
import { useUserStore } from "./store/userStore";

// Auth guard component
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { currentUser } = useUserStore();
  
  if (!currentUser.isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Admin guard component
const RequireAdmin = ({ children }: { children: JSX.Element }) => {
  const { currentUser } = useUserStore();
  
  if (!currentUser.isAuthenticated || currentUser.role !== 'admin') {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            } />
            <Route path="courses" element={<CoursesList />} />
            <Route path="courses/new" element={
              <RequireAdmin>
                <CreateCourse />
              </RequireAdmin>
            } />
            <Route path="courses/:courseId" element={<CourseDetail />} />
            <Route path="dynamics" element={
              <RequireAuth>
                <DynamicsBank />
              </RequireAuth>
            } />
            <Route path="edu" element={
              <RequireAuth>
                <EduAI />
              </RequireAuth>
            } />
            <Route path="users" element={
              <RequireAdmin>
                <Users />
              </RequireAdmin>
            } />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
