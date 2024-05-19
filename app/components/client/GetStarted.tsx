"use client";
import React from "react";
import { Body } from "@/app/fonts/roboto";
import { useRouter } from "next/navigation";

const GetStarted = () => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/login")}
      className={`${Body.className} btn btn-primary hover:btn-secondary`}
      id="get-started"
    >
      Get Started
    </button>
  );
};

export default GetStarted;
