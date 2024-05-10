import React from "react";
import GetStarted from "./GetStarted";

import { Body } from "@/app/fonts/roboto";
import { Headings } from "@/app/fonts/roboto";
import Image from "next/image";

const Hero = () => {
  return (
    <div className="hero min-h-screen relative z-0">
      <Image
        src="/images/hero-bg2.jpg"
        alt="Background Image"
        layout="fill"
        objectFit="cover"
        className="w-full self-center shadow-lg"
        quality={100}
      />
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md">
          <h1 className={`mb-5 text-5xl font-bold ${Headings.className}`}>
            Match. Create. Repeat.
          </h1>
          <p className={`mb-5 ${Body.className}`}>
            DevMatch is a platform that simplifies the process of finding and
            hiring expert freelance developers and designers for projects of all
            sizes
          </p>
          <GetStarted />
        </div>
      </div>
    </div>
  );
};

export default Hero;
