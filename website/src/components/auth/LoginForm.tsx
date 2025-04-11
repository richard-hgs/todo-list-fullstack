"use client";

import React, { useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import ErrorPopup from "@/components/popups/ErrorPopup";
import LoadingPopup from "@/components/popups/LoadingPopup";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { login } from "@/lib/reducers/authActions";

interface IFormInput {
  email: string;
  password: string;
}

const schema = yup.object<IFormInput>().shape({
  email: yup.string().email().required(),
  password: yup.string().required().min(6),
});

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  const router = useRouter();
  const dispatch = useAppDispatch();

  // Get Data from Redux Store
  const isAuthenticated = useAppSelector(
    (state) => state?.auth?.isAuthenticated ?? false
  );
  const isAuthenticating = useAppSelector(
    (state) => state?.auth?.isAuthenticating ?? false
  );
  const actionMessage = useAppSelector(
    (state) => state?.auth?.message ?? { type: null, message: null }
  );
  const [error, setError] = useState({
    open: false,
    message: "",
  });

  React.useEffect(() => {
    if (actionMessage.type === "error") {
      setError({ ...error, open: true, message: actionMessage.message });
    }
  }, [actionMessage]);

  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated]);

  function onSubmit(data: IFormInput) {
    dispatch(login(data));
  }

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          alt="Your Company"
        />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-100">
          Entre na sua conta
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          className="space-y-6"
          action="#"
          method="POST"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium text-gray-100"
            >
              Email
            </label>
            <div className="mt-2">
              <input
                {...register("email")}
                data-testid="email"
                required={true}
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />

              {errors.email && (
                <p className="text-red-400 text-sm mt-2">
                  Informe um e-mail válido
                </p>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-100"
              >
                Senha
              </label>
              {/*<div className="text-sm">*/}
              {/*  <a href="#" className="font-semibold text-indigo-300 hover:text-indigo-600">Esqueceu a Senha?</a>*/}
              {/*</div>*/}
            </div>
            <div className="mt-2">
              <input
                {...register("password")}
                required={true}
                data-testid="password"
                type="password"
                name="password"
                id="password"
                autoComplete="current-password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />

              {errors.password && (
                <p className="text-red-400 text-sm mt-2">Informe a senha</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
            >
              Entrar
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Não possui conta?
          <Link
            href="/register"
            className="font-semibold text-indigo-400 hover:text-indigo-500 pl-1"
          >
            Cadastre-se agora
          </Link>
        </p>
      </div>

      <ErrorPopup
        open={error.open}
        message={error.message}
        setOpen={(newOpen) => setError({ ...error, open: newOpen })}
      />

      <LoadingPopup open={isAuthenticating} />
    </div>
  );
}
