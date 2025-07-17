import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (token: string, expiresInMs?: number) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthPage = location.pathname === "/register" || location.pathname === "/";

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const token = localStorage.getItem("jwtToken");
    const expiresAt = localStorage.getItem("jwtExpiresAt");
    if (!token || !expiresAt) return false;
    return new Date().getTime() < parseInt(expiresAt);
  });

  useEffect(() => {
    const checkExpiry = () => {
      const token = localStorage.getItem("jwtToken");
      const expiresAt = localStorage.getItem("jwtExpiresAt");

      if (!token || !expiresAt) {
        if (!isAuthPage) {  
          logout();
        }
      } else if (new Date().getTime() > parseInt(expiresAt)) {
        logout();
      } else {
        setIsLoggedIn(true);
      }
    };

    const interval = setInterval(checkExpiry, 5000);
    return () => clearInterval(interval);
  }, [isAuthPage]);


  const login = (token: string, expiresInMs = 1000 * 60 * 60 * 2) => {
    const expiresAt = new Date().getTime() + expiresInMs;
    localStorage.setItem("jwtToken", token);
    localStorage.setItem("jwtExpiresAt", expiresAt.toString());
    setIsLoggedIn(true);
  };


  const logout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("jwtExpiresAt");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
