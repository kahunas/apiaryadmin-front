"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { getUserRole } from "@/utils/auth";

type AuthContextType = {
  role: string;
  updateRole: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<string>(getUserRole());

  const updateRole = () => {
    setRole(getUserRole());
  };

  return (
    <AuthContext.Provider value={{ role, updateRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
