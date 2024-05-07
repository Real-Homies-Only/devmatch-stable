import React, { Fragment } from "react";
import Logo from "../client/Logo";
import { AuthProvider } from "@/app/context/AuthContext";
import NavBarAccount from "../client/NavBarAccount";

const NavBar = () => {
  return (
    <Fragment>
      <AuthProvider>
        <div className="navbar bg-background shadow-sm">
          <Logo />
          <NavBarAccount />
        </div>
      </AuthProvider>
    </Fragment>
  );
};

export default NavBar;
