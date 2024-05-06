"use client";
import { AuthProvider } from "@/app/context/AuthContext";
import React from "react";
import RegisterForm from "../client/RegisterForm";

const RegisterAuth = () => {
  return (
    <AuthProvider>
      <div className="flex flex-1 items-center h-screen justify-center">
        <RegisterForm />
      </div>
    </AuthProvider>
  );
};

export default RegisterAuth;
