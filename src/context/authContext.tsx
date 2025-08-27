import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (token: string, username: string, userId: string, expiresInMs?: number) => void;
  logout: () => void;
  username?: string;
  userId?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthPage = ["/", "/login", "/register", "/verificationPage", "/confirm-email"].includes(location.pathname);

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const token = localStorage.getItem("jwtToken");
    const expiresAt = localStorage.getItem("jwtExpiresAt");
    if (!token || !expiresAt) return false;
    return new Date().getTime() < parseInt(expiresAt);
  });

  const [username, setUsername] = useState<string | undefined>(() => {
    return localStorage.getItem("username") || undefined;
  });

  const [userId, setUserId] = useState<string | undefined>(() => {
    return localStorage.getItem("userId") || undefined;
  });

  const login = (token: string, username: string, userId: string, expiresInMs = 1000 * 60 * 60 * 2) => {
    const expiresAt = new Date().getTime() + expiresInMs;
    localStorage.setItem("jwtToken", token);
    localStorage.setItem("jwtExpiresAt", expiresAt.toString());
    localStorage.setItem("username", username);
    localStorage.setItem("userId", userId); 
    setIsLoggedIn(true);
    setUsername(username);
    setUserId(userId);
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("jwtExpiresAt");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    setUsername(undefined);
    setUserId(undefined);
    navigate("/");
  };

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

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
