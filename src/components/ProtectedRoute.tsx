import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/temo";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();

  return isLoggedIn ? children : <Navigate to="/" />;
}
