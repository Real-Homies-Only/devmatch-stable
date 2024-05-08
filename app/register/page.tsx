import React from "react";
import { AuthProvider } from "../context/AuthContext";
import RegisterForm from "../components/client/RegisterForm";

const Register = () => {
  return (
    <AuthProvider>
      <div className="flex flex-1 items-center h-screen justify-center">
        <RegisterForm />
      </div>
    </AuthProvider>
  );
};

export default Register;
