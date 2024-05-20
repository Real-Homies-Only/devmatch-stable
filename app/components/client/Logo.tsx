"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Logo = () => {
  const router = useRouter();
  return (
    <div className="navbar-start flex items-center">
      <span
        onClick={() => router.push("/")}
        className="btn btn-ghost btn-sm text-xl text-primary hover:text-secondary hover:text-2xl md:hidden flex items-center h-full"
      >
        <Image
          src="/images/logo-only.png"
          alt="Logo Only"
          width={35}
          height={35}
          className="mr-2"
        />
      </span>

      <span
        onClick={() => router.push("/")}
        className="btn btn-ghost btn-sm text-xl text-primary hover:text-secondary hover:text-2xl hidden md:flex items-center h-full"
      >
        <Image
          src="/images/logo-with-text.png"
          alt="Logo with Text"
          width={150}
          height={40}
        />
      </span>
    </div>
  );
};

export default Logo;
