import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "../pages/auth/Login";
import AdminDashboard from "../pages/admin/AdminDashboard";
import StudentDashboard from "../pages/student/StudentDashboard";
import OrganizerDashboard from "../pages/organizer/OrganizerDashboard";

function ProtectedRoute({ children, allowedRoles }) {
    const { isAuthenticated, role } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        if (role === "ADMIN") return <Navigate to="/admin" replace />;
        if (role === "STUDENT") return <Navigate to="/student" replace />;
        if (role === "ORGANIZER") return <Navigate to="/organizer" replace />;
        return <Navigate to="/login" replace />;
    }

    return children;
}

function RoleRedirect() {
    const { isAuthenticated, role } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (role === "ADMIN") return <Navigate to="/admin" replace />;
    if (role === "STUDENT") return <Navigate to="/student" replace />;
    if (role === "ORGANIZER") return <Navigate to="/organizer" replace />;

    return <Navigate to="/login" replace />;
}

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<RoleRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route
                path="/admin/*"
                element={
                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/student/*"
                element={
                    <ProtectedRoute allowedRoles={["STUDENT"]}>
                        <StudentDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/organizer/*"
                element={
                    <ProtectedRoute allowedRoles={["ORGANIZER", "ADMIN"]}>
                        <OrganizerDashboard />
                    </ProtectedRoute>
                }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default AppRoutes;