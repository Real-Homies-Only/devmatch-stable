"use client";
import React, { Fragment, useContext } from "react";
import AccountButtons from "./AccountButtons";
import ProfileButtons from "./ProfileButtons";
import { AuthContext } from "../../context/AuthContext";

const NavBarAccount = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="navbar-end mr-4">
        <span className=" loading loading-spinner loading-md"></span>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="navbar-end gap-2">
        {!user ? (
          <AccountButtons />
        ) : (
          <ProfileButtons
            profilePhotoURL={user.profilePicture}
            id={user.id}
            userType={user.userType}
          />
        )}
      </div>
    </Fragment>
  );
};

export default NavBarAccount;
