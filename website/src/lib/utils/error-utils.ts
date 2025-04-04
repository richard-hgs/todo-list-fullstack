import { AxiosError } from "axios";


export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return error?.response?.data?.message ?? error?.message
  } else if (error instanceof Error) {
    return error?.message
  } else if (typeof error === "string") {
    return error
  } else {
    return "Erro desconhecido";
  }
}