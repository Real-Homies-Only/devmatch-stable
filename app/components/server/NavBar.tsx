import React, { Fragment } from "react";
import Logo from "../client/Logo";
import NavBarAuth from "../AuthProvider/NavBarAuth";

const NavBar = () => {
  return (
    <Fragment>
      <div className="navbar bg-background shadow-sm">
        <Logo />
        <NavBarAuth />
      </div>
    </Fragment>
  );
};

export default NavBar;
