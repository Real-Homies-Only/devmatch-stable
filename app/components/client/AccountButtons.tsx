"use client";
import React, { Fragment } from "react";
import { useRouter } from "next/navigation";

const AccountButtons = () => {
  const router = useRouter();
  return (
    <Fragment>
      <div
        onClick={() => router.push("/login")}
        className="btn btn-outline btn-secondary btn-sm"
      >
        Log In
      </div>
      <div
        onClick={() => router.push("/register")}
        className="btn btn-primary text-white btn-sm"
      >
        Sign Up
      </div>
    </Fragment>
  );
};

export default AccountButtons;
