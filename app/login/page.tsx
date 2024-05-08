import React from "react";
import { AuthProvider } from "../context/AuthContext";
import LoginForm from "../components/client/LoginForm";

const Login = () => {
  return (
    <AuthProvider>
      <div className="flex flex-1 items-center h-screen justify-center">
        <LoginForm />
      </div>
    </AuthProvider>
  );
};

export default Login;
