"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@mdi/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useContext } from "react";
import Modal from "react-modal";

import { mdiGoogle, mdiArrowLeft } from "@mdi/js";
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
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const { loginWithEmail, loading, user } = useContext(AuthContext);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginForm>({ resolver: zodResolver(LoginFormSchema) });

  const handleLogin = async (loginData: LoginForm) => {
    const { email, password } = loginData;
    try {
      const result = await loginWithEmail(email, password);
      if (result === true) {
        setLoggedIn(true);
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        throw new Error();
      }
    } catch (err) {
      setErrorMessage("Invalid email or password");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col w-full items-center">
        <span className="loading loading-lg text-primary" />
      </div>
    );
  }

  if (user) {
    router.back();
    return <div></div>;
  }

  return (
    <div className="artboard w-96 bg-background rounded-md flex flex-col p-4 shadow-lg">
      <Modal
        isOpen={loggedIn}
        contentLabel="Loading..."
        className="fixed inset-0 z-50 flex items-center justify-center"
        overlayClassName="fixed inset-0 z-40 bg-gray-500 bg-opacity-75"
      >
        <div
          className={`flex flex-col gap-4 items-center ${Headings.className}`}
        >
          <span className="text-xl text-primary">
            Logged in! Redirecting...
          </span>
          <span className="loading loading-spinner text-primary loading-lg" />
        </div>
      </Modal>
      <div
        className={`${Body.className} flex flex-col gap-2 hover:bg-gray-300`}
        onClick={() => router.back()}
      >
        <Icon path={mdiArrowLeft} size={1} />
        <span>Back</span>
      </div>
      <div className={`${Headings.className} text-xl mb-4 self-center`}>
        Join DevMatch
      </div>
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
            <span className="text-letter mb-2 mt-1">
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
            <span className="text-letter mb-2 mt-1">
              {String(errors.password.message)}
            </span>
          )}
        </div>

        {errorMessage && (
          <div className="self-center">
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
