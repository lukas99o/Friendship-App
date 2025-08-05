import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function PublicRoute({ children }: { children: React.ReactNode }) {
    const { isLoggedIn } = useAuth();

    if (isLoggedIn) {
    return <Navigate to="/events" replace />;
    }

    return children;
}
