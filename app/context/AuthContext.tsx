"use client";
import React, { createContext, useState, ReactNode, useEffect } from "react";
import { UserType } from "../utils/UserProps";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";
import { auth } from "../utils/firebaseConfig";

interface AuthContextValue {
  user: UserType | null;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const defaultValue: AuthContextValue = {
  user: null,
  login: () => {},
  logout: () => {}
};

export const AuthContext = createContext<AuthContextValue>(defaultValue);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  });

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value: AuthContextValue = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
