import React from "react";
import { AuthProvider } from "../../context/AuthContext";
import NavBarAccount from "../client/NavBarAccount";

const NavBarAuth = () => {
  return (
    <AuthProvider>
      <NavBarAccount />
    </AuthProvider>
  );
};

export default NavBarAuth;
