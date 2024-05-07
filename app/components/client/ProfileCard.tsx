"use client";
import { AuthContext } from "@/app/context/AuthContext";
import React, { Fragment, useContext } from "react";

const ProfileCard = () => {
  const { user, loading } = useContext(AuthContext);
  if (loading) {
    return (
      <div className="artboard phone-6 shadow-md">
        <span className="loading loading-spinner loading-xs"></span>
      </div>
    );
  }
  return (
    <Fragment>
      <div className="artboard w-full lg:mx-12 mx-4 mt-4 shadow-md">
        {user && `Hello ${user.firstName}!`}
      </div>
    </Fragment>
  );
};

export default ProfileCard;
