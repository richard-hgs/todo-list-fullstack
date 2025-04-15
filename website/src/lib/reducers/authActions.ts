// noinspection ExceptionCaughtLocallyJS,DuplicatedCode
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import { API } from "@/config/App.config";
import { getErrorMessage } from "@/lib/utils/error-utils";

// Import Reducers
import {
  setIsAuthenticated,
  setIsAuthenticating,
  setIsCodeResend,
  setIsRegistered,
  setMessage,
  setToken,
  setUser,
} from "../reducers/authReducer";

/**
 * Registers a new user by sending their data to the API.
 *
 * @param {unknown} user - The user data to register.
 * @param {object} thunkAPI - The thunk API object provided by Redux Toolkit.
 * @returns {Promise<void>} A promise that resolves when the registration is complete.
 */
export const register = createAsyncThunk(
  "auth/register",
  async (user: unknown, { dispatch }) => {
    // Set Is Authenticating `true`
    dispatch(setIsAuthenticating(true));

    // clear registration status
    dispatch(setIsRegistered(false));

    try {
      await axios.post(API.USER.BASE, user);

      // Registration success
      dispatch(setIsRegistered(true));

      // Set Is Authenticating `false`
      dispatch(setIsAuthenticating(false));
    } catch (err) {
      // Dispatch `authReducer` Values to Redux Store
      dispatch(setIsRegistered(false));
      dispatch(setMessage({ type: "error", message: getErrorMessage(err) }));

      // Set Is Authenticating `false`
      dispatch(setIsAuthenticating(false));
    }
  }
);

/**
 * Resends the activation code to the user's email.
 *
 * @param {unknown} user - The user data containing the email.
 * @param {object} thunkAPI - The thunk API object provided by Redux Toolkit.
 * @returns {Promise<void>} A promise that resolves when the activation code is resent.
 */
export const resendActivationCode = createAsyncThunk(
  "auth/resendCode",
  async (user: unknown, { dispatch }) => {
    const mUser = user as unknown as { [key: string]: unknown };

    // Set Is Authenticating `true`
    dispatch(setIsAuthenticating(true));

    // clear activation code status
    dispatch(setIsCodeResend(false));

    try {
      await axios.post(API.OTP.RESEND, {
        userEmail: mUser["email"],
        otpUseCase: "AccountActivation",
      });

      // notify activation code success status
      dispatch(setIsCodeResend(true));

      // Set Is Authenticating `true`
      dispatch(setIsAuthenticating(false));
    } catch (err) {
      // Show error
      console.error(err);

      // Dispatch `authReducer` Values to Redux Store
      dispatch(setMessage({ type: "error", message: getErrorMessage(err) }));

      // Set Is Authenticating `false`
      dispatch(setIsAuthenticating(false));
    }
  }
);

/**
 * Logs in a user by validating their credentials and retrieving a token.
 *
 * @param {unknown} user - The user credentials for login.
 * @param {object} thunkAPI - The thunk API object provided by Redux Toolkit.
 * @returns {Promise<void>} A promise that resolves when the login is complete.
 */
export const login = createAsyncThunk(
  "auth/login",
  async (user: unknown, { dispatch }) => {
    // Set Is Authenticating `true`
    dispatch(setIsAuthenticating(true));

    try {
      const res = await axios.post(API.AUTH.LOGIN, user);

      // If Error or Token Doesn't Exist
      if (!res?.data?.accessToken) {
        throw new Error("Token de acesso não recebido.");
      }

      const token = res.data.accessToken;

      // Validate User By Token
      dispatch(validateUser(token));
    } catch (err) {
      // Show error
      console.error(err);

      // Dispatch `authReducer` Values to Redux Store
      dispatch(setIsAuthenticated(false));
      dispatch(setToken(null));
      dispatch(setUser({}));
      dispatch(setMessage({ type: "error", message: getErrorMessage(err) }));

      // Set Is Authenticating `false`
      dispatch(setIsAuthenticating(false));
    }
  }
);

/**
 * Validates a user by their token and retrieves their information.
 *
 * @param {string | null} token - The user's authentication token.
 * @param {object} thunkAPI - The thunk API object provided by Redux Toolkit.
 * @returns {Promise<void>} A promise that resolves when the user is validated.
 */
export const validateUser = createAsyncThunk(
  "auth/validateUser",
  async (token: string | null, { dispatch }) => {
    // Set Is Authenticating `true`
    dispatch(setIsAuthenticating(true));

    try {
      // If Token Doesn't Exist
      if (!token) {
        throw new Error("Usuário não encontrado");
      }

      const res = await axios.get(API.USER.GET_USER, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // If Error or User Doesn't Exist
      if (!res?.data) {
        throw new Error("Usuário não encontrado");
      }

      const user = res.data;

      // Dispatch `authReducer` Values to Redux Store
      dispatch(setIsAuthenticated(true));
      dispatch(setToken(token));
      dispatch(setUser(user));

      // Set Is Authenticating `false`
      dispatch(setIsAuthenticating(false));
    } catch (err) {
      // Show error
      console.error(err);

      // Dispatch `authReducer` Values to Redux Store
      dispatch(setIsAuthenticated(false));
      dispatch(setToken(null));
      dispatch(setUser({}));
      dispatch(setMessage({ type: "error", message: getErrorMessage(err) }));

      // Set Is Authenticating `false`
      dispatch(setIsAuthenticating(false));
    }
  }
);

/**
 * Logs out the user by clearing their session and resetting authentication state.
 *
 * @param {unknown} e - An optional event parameter (not used).
 * @param {object} thunkAPI - The thunk API object provided by Redux Toolkit.
 * @returns {Promise<void>} A promise that resolves when the logout is complete.
 */
export const logout = createAsyncThunk(
  "auth/logout",
  async (_e, { dispatch }) => {
    // Set Is Authenticating `true`
    dispatch(setIsAuthenticating(true));

    // Clear localStorage
    localStorage.clear();

    // Dispatch `authReducer` Values to Redux Store
    dispatch(setIsAuthenticated(false));
    dispatch(setToken(null));
    dispatch(setUser({}));

    // Set Is Authenticating `false`
    dispatch(setIsAuthenticating(false));
  }
);
