"use client";
import React, { createContext, useState, ReactNode, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword
} from "firebase/auth";

import { UserInterface } from "../utils/UserProps";
import { auth } from "../utils/firebaseConfig";

interface AuthContextValue {
  user: UserInterface | null;
  loading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  signUpWithEmail: (
    displayName: string,
    username: string,
    userType: string,
    email: string,
    password: string
  ) => Promise<boolean>;
}

const defaultValue: AuthContextValue = {
  user: null,
  loading: true,
  loginWithEmail: () => Promise.resolve(false),

  logout: () => Promise.resolve(false),
  signUpWithEmail: () => Promise.resolve(false)
};

export const AuthContext = createContext<AuthContextValue>(defaultValue);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserInterface | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        const response = await fetch(`/api/user/${currentUser.uid}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });
        const { user } = await response.json();

        const userInfo = {
          id: currentUser.uid,
          displayName: user.displayName,
          username: user.username,
          profilePicture: user.profilePicture,
          bio: user.bio,
          location: user.location,
          userType: user.userType,
          isAdmin: user.isAdmin
        };

        if (response.ok) {
          setUser(userInfo);
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
        console.log();
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const response = await fetch(`/api/user/${user.uid}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      const database = await response.json();
      if (!user) {
        throw new Error();
      } else if (user && !database.user) {
        throw new Error();
      } else {
        return true;
      }
    } catch (err) {
      return false;
    }
  };

  const logout = async (): Promise<boolean> => {
    try {
      await signOut(auth);
      return true;
    } catch (err) {
      return false;
    }
  };

  const signUpWithEmail = async (
    displayName: string,
    username: string,
    userType: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const data = {
        id: user.uid,
        displayName: displayName,
        username: username,
        userType: userType
      };

      const response = await fetch(`/api/register/${user.uid}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        return true;
      } else {
        throw new Error();
      }
    } catch (err) {
      return false;
    }
  };

  const value: AuthContextValue = {
    user,
    loginWithEmail,
    logout,
    signUpWithEmail,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
