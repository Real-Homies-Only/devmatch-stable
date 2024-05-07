"use client";
import React from "react";
import { useRouter } from "next/navigation";

const Logo = () => {
  const router = useRouter();
  return (
    <div className="navbar-start">
      <span
        onClick={() => router.push("/")}
        className="btn btn-ghost btn-sm text-xl text-primary hover:text-secondary hover:text-2xl"
      >
        DM
      </span>
    </div>
  );
};

export default Logo;
