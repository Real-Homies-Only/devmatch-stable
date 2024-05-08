"use client";
import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import Icon from "@mdi/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AuthContext } from "@/app/context/AuthContext";

import { mdiGoogle } from "@mdi/js";
import { Headings } from "@/app/fonts/roboto";
import { Body } from "@/app/fonts/roboto";

const RegisterFormSchema = z
  .object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
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
  const { signUp } = useContext(AuthContext);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterForm>({ resolver: zodResolver(RegisterFormSchema) });

  const handleRegister = async (registerData: RegisterForm) => {
    const { firstName, lastName, username, email, password, userType } =
      registerData;
    try {
      const result = await signUp(
        firstName,
        lastName,
        username,
        userType,
        email,
        password
      );
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
        onSubmit={handleSubmit(handleRegister)}
        className={`${Body.className} self-center w-full flex flex-col gap-8`}
      >
        <div className="gap-1">
          <label className="shadow-sm input input-bordered border-primary flex items-center gap-2">
            <span className="border-r border-primary pr-2 text-sm">
              First Name
            </span>
            <input
              type="text"
              className="grow"
              placeholder="AJ"
              {...register("firstName")}
            />
          </label>
          {errors.firstName && (
            <span className="text-letter">
              {String(errors.firstName.message)}
            </span>
          )}
        </div>
        <div className="gap-1">
          <label className="shadow-sm input input-bordered border-primary flex items-center gap-2">
            <span className="border-r border-primary pr-2 text-sm">
              Last Name
            </span>
            <input
              type="text"
              className="grow"
              placeholder="Aparicio"
              {...register("lastName")}
            />
          </label>
          {errors.lastName && (
            <span className="text-letter mt-1">
              {String(errors.lastName.message)}
            </span>
          )}
        </div>
        <div className="gap-1">
          <label className="shadow-sm input input-bordered border-primary flex items-center gap-2">
            <span className="border-r border-primary pr-2 text-sm">
              Username
            </span>
            <input
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
            className="select select-primary w-full max-w-xs"
            {...register("userType")}
          >
            <option disabled selected>
              What will you be on our platform?
            </option>
            <option>Developer</option>
            <option>Client</option>
          </select>
          {errors.userType && (
            <span className="text-letter mt-2">
              {String(errors.userType.message)}
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
      <div className="divider divider-primary">OR</div>
      <button
        className={`${Body.className} flex flex-row items-center font-light btn btn-outline btn-letter border-primary self-center`}
      >
        <Icon path={mdiGoogle} size={0.8} />
        <span>Register with Google</span>
      </button>
    </div>
  );
};

export default RegisterForm;
