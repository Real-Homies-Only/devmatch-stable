"use client";
import { AuthProvider } from "@/app/context/AuthContext";
import React from "react";
import LoginForm from "../client/LoginForm";

const LoginAuth = () => {
  return (
    <AuthProvider>
      <div className="flex flex-1 items-center h-screen justify-center">
        <LoginForm />
      </div>
    </AuthProvider>
  );
};

export default LoginAuth;
