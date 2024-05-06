"use client";
import React, { Fragment, useContext } from "react";
import AccountButtons from "./AccountButtons";
import ProfileButtons from "./ProfileButtons";
import { AuthContext } from "../../context/AuthContext";

const NavBarAccount = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <span className="loading loading-spinner loading-xs"></span>;
  }

  return (
    <Fragment>
      <div className="navbar-end gap-2">
        {!user ? <AccountButtons /> : <ProfileButtons />}
      </div>
    </Fragment>
  );
};

export default NavBarAccount;
