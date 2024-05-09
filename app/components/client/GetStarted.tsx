import React from "react";
import { Body } from "@/app/fonts/roboto";

const GetStarted = () => {
  return (
    <button className={`${Body.className} btn btn-primary hover:btn-secondary`}>
      Get Started
    </button>
  );
};

export default GetStarted;
