'use client';

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { login, register as registerUser, resendActivationCode } from "@/lib/reducers/authActions";
import ErrorPopup from "@/components/popups/ErrorPopup";
import React, { useState } from "react";
import SuccessPopup from "@/components/popups/SuccessPopup";
import Link from "next/link"
import LoadingPopup from "@/components/popups/LoadingPopup";
import { useRouter } from "next/navigation";

interface IFormInput {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

const schema = yup.object<IFormInput>().shape({
  name   : yup.string().required().max(50),
  email   : yup.string().email().required().max(50),
  password: yup.string().required().min(8).max(16),
  passwordConfirm: yup.string().required().min(8).max(16)
});

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    formState: {errors}
  } = useForm<IFormInput>({
    mode    : "onBlur",
    resolver: yupResolver(schema)
  });

  const router = useRouter()
  const dispatch = useAppDispatch();
  // Get Data from Redux Store
  const isAuthenticating = useAppSelector(state => state?.auth?.isAuthenticating ?? false)
  const isRegistered = useAppSelector(state => state?.auth?.isRegistered ?? false)
  const isCodeResend = useAppSelector(state => state?.auth?.isCodeResend ?? false)
  const actionMessage = useAppSelector(state => state?.auth?.message ?? {type: null, message: null})
  const [warning, setWarning] = useState({
    open: false,
    message: ""
  });
  const [success, setSuccess] = useState({
    open: false,
    message: "",
    onDismiss: () => {}
  });

  React.useEffect(() => {
    if (actionMessage.type === "error") {
      setWarning({...warning, open: true, message: actionMessage.message})
    }
  }, [actionMessage]);

  React.useEffect(() => {
    if (isRegistered) {
      setSuccess({
        ...success, open: true, message: "Código de ativação enviado para o seu e-mail. Verifique o spam.",
        onDismiss: () => {
          navigateToSignInScreen()
        }
      })
    }
  }, [isRegistered]);

  React.useEffect(() => {
    if (isCodeResend) {
      setSuccess({
        ...success, open: true, message: "Código de ativação reenviado para o seu e-mail. Verifique o spam.",
        onDismiss: () => {
          navigateToSignInScreen()
        }
      })
    }
  }, [isCodeResend]);

  function onSubmit(data: IFormInput) {
    dispatch(registerUser(data));
  }

  async function onResendEmailActivation() {
    const isValid = await trigger("email")
    if (isValid) {
      const values = getValues()
      dispatch(resendActivationCode(values)).then(() => {
        setSuccess({...success, open: true, message: "Código de ativação reenviado para o seu e-mail. Verifique o spam.",
          onDismiss: () => {
            navigateToSignInScreen()
          }}
        )
      })
    }
  }

  function navigateToSignInScreen() {
    router.replace("/");
  }

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img className="mx-auto h-10 w-auto"
             src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-100">Cadastre-se</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" action="#" method="POST" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-100">Nome</label>
            <div className="mt-2">
              <input
                {...register("name")}
                type="name" name="name" id="name" autoComplete="name" required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>

              {errors.name && (
                <p className="text-red-400 text-sm mt-2">
                  Informe um nome válido
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-100">Email</label>
            <div className="mt-2">
              <input
                {...register("email")}
                type="email" name="email" id="email" autoComplete="email" required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>

              {errors.email && (
                <p className="text-red-400 text-sm mt-2">
                  Informe um e-mail válido
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-100">Senha</label>
            <div className="mt-2">
              <input
                {...register("password")}
                type="password" name="password" id="password" autoComplete="current-password" required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>

              {errors.password && (
                <p className="text-red-400 text-sm mt-2">
                  Senha inválida
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-100">Confirmação de senha</label>
            <div className="mt-2">
              <input
                {...register("passwordConfirm")}
                type="password" name="passwordConfirm" id="passwordConfirm" autoComplete="current-password" required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"/>

              {errors.passwordConfirm && (
                <p className="text-red-400 text-sm mt-2">
                  Confirmação de senha inválida
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer">
              Cadastrar
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Reenviar email de ativação?
          <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-500 pl-1" onClick={() => onResendEmailActivation()}>Reenviar o e-mail</a>
        </p>

        <p className="mt-10 text-center text-sm/6 text-gray-500">
          Já possui conta?
          <Link href="/" className="font-semibold text-indigo-400 hover:text-indigo-500 pl-1">Entre agora</Link>
        </p>
      </div>

      <ErrorPopup
        open={warning.open}
        message={warning.message}
        setOpen={(newOpen) => setWarning({...warning, open: newOpen})}
      />

      <SuccessPopup
        open={success.open}
        message={success.message}
        setOpen={(newOpen) => {
          success.onDismiss()
          setSuccess({...success, open: newOpen})}
        }
      />

      <LoadingPopup open={isAuthenticating} />
    </div>
  )
}