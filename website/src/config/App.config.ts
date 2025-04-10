const API_HOST = process.env.NEXT_PUBLIC_API_HOST;

export const API = {
  AUTH: {
    LOGIN: `${API_HOST}/auth/login`,
  },
  USER: {
    BASE: `${API_HOST}/users`,
    GET_USER: `${API_HOST}/users/me`,
  },
  OTP: {
    RESEND: `${API_HOST}/otp/resend`,
  },
  TODO_TASKS: {
    BASE: `${API_HOST}/todo-task`,
    ALL: `${API_HOST}/todo-task/all`,
  },
};
