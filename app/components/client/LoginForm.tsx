"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@mdi/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useContext } from "react";

import { mdiGoogle } from "@mdi/js";
import { AuthContext } from "@/app/context/AuthContext";
import { Headings } from "@/app/fonts/roboto";
import { Body } from "@/app/fonts/roboto";

const LoginFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

type LoginForm = z.infer<typeof LoginFormSchema>;

const LoginForm = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { login } = useContext(AuthContext);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginForm>({ resolver: zodResolver(LoginFormSchema) });

  const handleLogin = async (loginData: LoginForm) => {
    const { email, password } = loginData;
    try {
      const result = await login(email, password);
      if (result === true) {
        router.push("/");
      } else {
        throw new Error();
      }
    } catch (err) {
      setErrorMessage("Invalid email or password");
    }
  };

  return (
    <div className="artboard w-96 bg-background rounded-md flex flex-col p-4 shadow-lg">
      <div className={`${Headings.className} text-xl mb-4`}>Join DevMatch</div>
      <form
        onSubmit={handleSubmit(handleLogin)}
        className={`${Body.className} self-center w-full flex flex-col gap-8`}
      >
        <div className="gap-1">
          <label className="shadow-sm input input-bordered border-primary flex items-center gap-2">
            <span className="border-r border-primary pr-2 text-sm">Email</span>
            <input
              type="text"
              className="grow"
              placeholder="email@gmail.com"
              required
              {...register("email")}
            />
          </label>
          {errors.email && (
            <span className="text-letter mb-2">
              {String(errors.email.message)}
            </span>
          )}
        </div>
        <div className="gap-1">
          <label className="shadow-sm input input-bordered border-primary flex items-center gap-2">
            <span className="border-r border-primary pr-2 text-sm">
              Password
            </span>
            <input
              type="password"
              className="grow"
              placeholder="******"
              required
              {...register("password")}
            />
          </label>
          {errors.password && (
            <span className="text-letter mb-2">
              {String(errors.password.message)}
            </span>
          )}
        </div>

        {errorMessage && (
          <div>
            <span className="text-sm text-red-700">{errorMessage}</span>
          </div>
        )}

        <div className="flex flex-1 flex-row self-center gap-8 items-center">
          <button
            type="submit"
            className="btn btn-outline btn-primary self-start"
          >
            Log In
          </button>
          <div className="flex flex-col ">
            <a href="/register" className="hover:underline cursor-pointer">
              {"I don't have an account"}
            </a>
            <a className="hover:underline cursor-pointer">
              {"I forgot my password"}
            </a>
          </div>
        </div>
      </form>
      <div className="divider divider-primary">OR</div>
      <button
        className={`${Body.className} flex flex-row items-center font-light btn btn-outline btn-letter border-primary self-center`}
      >
        <Icon path={mdiGoogle} size={0.8} />
        <span>Login With Google</span>
      </button>
    </div>
  );
};

export default LoginForm;
