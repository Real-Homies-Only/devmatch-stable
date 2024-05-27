"use client";
import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import Icon from "@mdi/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AuthContext } from "@/app/context/AuthContext";
import Modal from "react-modal";

import { mdiArrowLeft } from "@mdi/js";
import { Headings } from "@/app/fonts/roboto";
import { Body } from "@/app/fonts/roboto";

const RegisterFormSchema = z
  .object({
    displayName: z
      .string()
      .min(2, "Display name should be more than 2 characters"),
    username: z
      .string()
      .min(4, "Username should be more than 4 characters")
      .max(14, "Username should be less than 14 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password should be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password should be at least 6 characters"),
    userType: z.enum(["Developer", "Client"], {
      message: "Please select a user type"
    })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

type RegisterForm = z.infer<typeof RegisterFormSchema>;

const RegisterForm = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [registered, setRegistered] = useState<boolean>(false);
  const { signUpWithEmail, loading, user } = useContext(AuthContext);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterForm>({ resolver: zodResolver(RegisterFormSchema) });

  const handleRegister = async (registerData: RegisterForm) => {
    const { displayName, username, email, password, userType } = registerData;
    try {
      const result = await signUpWithEmail(
        displayName,
        username,
        userType,
        email,
        password
      );
      if (result === true) {
        setRegistered(true);
        setTimeout(() => {
          router.push("/");
        }, 3500);
      } else {
        throw new Error();
      }
    } catch (err) {
      setErrorMessage("Email already in use!");
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
    router.push("/");
    return <div></div>;
  }

  return (
    <div className="artboard w-96 bg-background rounded-md flex flex-col p-4 shadow-lg">
      <div
        className={`${Body.className} flex flex-row gap-2 mb-2 `}
        onClick={() => router.back()}
      >
        <span className="flex flex-row px-2 rounded-md gap-2 hover:bg-gray-300 cursor-pointer">
          <Icon path={mdiArrowLeft} size={1} />
          Back
        </span>
      </div>
      <div className={`${Headings.className} text-xl mb-4 self-center`}>
        Join DevMatch
      </div>
      <Modal
        isOpen={registered}
        contentLabel="Loading..."
        className="fixed inset-0 z-50 flex items-center justify-center"
        overlayClassName="fixed inset-0 z-40 bg-gray-500 bg-opacity-75"
      >
        <div
          className={`flex flex-col gap-4 items-center ${Headings.className}`}
        >
          <span className="text-xl text-white">
            Registered user! Redirecting to home page...
          </span>
          <span className="loading loading-spinner text-primary loading-lg" />
        </div>
      </Modal>
      <form
        data-testid="register-form"
        id="register-form"
        onSubmit={handleSubmit(handleRegister)}
        className={`${Body.className} self-center w-full flex flex-col gap-8`}
      >
        <div className="gap-1">
          <label className="shadow-sm input input-bordered border-primary flex items-center gap-2">
            <span className="border-r border-primary pr-2 text-sm">
              Display Name
            </span>
            <input
              id="display-name"
              type="text"
              className="grow"
              placeholder="AJ Aparicio"
              {...register("displayName")}
            />
          </label>
          {errors.displayName && (
            <span className="text-letter mt-1">
              {String(errors.displayName.message)}
            </span>
          )}
        </div>
        <div className="gap-1">
          <label className="shadow-sm input input-bordered border-primary flex items-center gap-2">
            <span className="border-r border-primary pr-2 text-sm">
              Username
            </span>
            <input
              id="username"
              type="text"
              className="grow"
              placeholder="aj.aparicio36"
              {...register("username")}
            />
          </label>
          {errors.username && (
            <span className="text-letter mt-1">
              {String(errors.username.message)}
            </span>
          )}
        </div>
        <div className="gap-1">
          <label className="shadow-sm input input-bordered border-primary flex items-center gap-2">
            <span className="border-r border-primary pr-2 text-sm">Email</span>
            <input
              id="email"
              type="text"
              className="grow"
              placeholder="email@gmail.com"
              {...register("email")}
            />
          </label>
          {errors.email && (
            <span className="text-letter">{String(errors.email.message)}</span>
          )}
        </div>
        <div className="gap-1">
          <label className="shadow-sm input input-bordered border-primary flex items-center gap-2">
            <span className="border-r border-primary pr-2 text-sm">
              Password
            </span>
            <input
              id="password"
              type="password"
              className="grow"
              placeholder="******"
              {...register("password")}
            />
          </label>
          {errors.password && (
            <span className="text-letter mt-1">
              {String(errors.password.message)}
            </span>
          )}
        </div>
        <div className="gap-1">
          <label className="shadow-sm input input-bordered border-primary flex items-center gap-2">
            <span className="border-r border-primary pr-2 text-sm">
              Confirm Password
            </span>
            <input
              id="confirm-password"
              type="password"
              className="grow"
              placeholder="******"
              {...register("confirmPassword")}
            />
          </label>
          {errors.confirmPassword && (
            <span className="text-letter mt-1">
              {String(errors.confirmPassword.message)}
            </span>
          )}
        </div>
        <div className="gap-1 self-center">
          <select
            data-testid="user-type"
            id="user-type"
            className="select select-primary w-full max-w-xs"
            {...register("userType")}
          >
            <option disabled selected>
              What will you be on our platform?
            </option>
            <option id="developer">Developer</option>
            <option id="client">Client</option>
          </select>
          {errors.userType && (
            <span className="text-letter mt-2">
              {String(errors.userType.message)}
            </span>
          )}
        </div>
        {errorMessage && (
          <div id="error-message" className="self-center">
            <span className="text-sm text-red-700">{errorMessage}</span>
          </div>
        )}
        <div
          data-testid="buttons"
          className="flex flex-1 flex-row self-center gap-8 items-center"
        >
          <button
            id="submit"
            type="submit"
            className="btn btn-outline btn-primary self-start"
          >
            Register
          </button>
          <a
            onClick={() => router.push("/login")}
            className="hover:underline cursor-pointer"
          >
            I already have an account
          </a>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
