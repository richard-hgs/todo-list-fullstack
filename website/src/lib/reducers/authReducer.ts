import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

/**
 * Logs out the user by clearing their session and resetting authentication state.
 *
 * @param {unknown} e - An optional event parameter (not used).
 * @param {object} thunkAPI - The thunk API object provided by Redux Toolkit.
 * @returns {Promise<void>} A promise that resolves when the logout is complete.
 */
interface Message {
  type: string;
  message: string;
}

/**
 * Interface representing the authentication state.
 *
 * @interface authState
 * @property {boolean} isAuthenticated - Indicates if the user is authenticated.
 * @property {boolean} isAuthenticating - Indicates if authentication is in progress.
 * @property {boolean} isRegistered - Indicates if the user is registered.
 * @property {boolean} isCodeResend - Indicates if the activation code has been resent.
 * @property {null | string} token - The authentication token, or null if not available.
 * @property {object} user - The user object containing user details.
 * @property {Message} message - The message object containing type and content.
 */
interface authState {
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  isRegistered: boolean;
  isCodeResend: boolean;
  token: null | string;
  user: object;
  message: Message;
}

/**
 * The initial state of the authentication slice.
 *
 * @constant
 * @type {authState}
 */
const initialState: authState = {
  isAuthenticated: false,
  isAuthenticating: false,
  isRegistered: false,
  isCodeResend: false,
  token: null,
  user: {},
  message: {
    type: "",
    message: "",
  },
};

/**
 * A slice for managing authentication state.
 *
 * @constant
 */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Sets the authentication status of the user.
     *
     * @param {authState} state - The current state.
     * @param {PayloadAction<boolean>} action - The action containing the new authentication status.
     */
    setIsAuthenticated: (state: authState, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    /**
     * Sets the authentication progress status.
     *
     * @param {authState} state - The current state.
     * @param {PayloadAction<boolean>} action - The action containing the new progress status.
     */
    setIsAuthenticating: (state: authState, action: PayloadAction<boolean>) => {
      state.isAuthenticating = action.payload;
    },
    /**
     * Sets the registration status of the user.
     *
     * @param {authState} state - The current state.
     * @param {PayloadAction<boolean>} action - The action containing the new registration status.
     */
    setIsRegistered: (state: authState, action: PayloadAction<boolean>) => {
      state.isRegistered = action.payload;
    },
    /**
     * Sets the status of whether the activation code has been resent.
     *
     * @param {authState} state - The current state.
     * @param {PayloadAction<boolean>} action - The action containing the new resend status.
     */
    setIsCodeResend: (state: authState, action: PayloadAction<boolean>) => {
      state.isCodeResend = action.payload;
    },
    /**
     * Sets the authentication token.
     *
     * @param {authState} state - The current state.
     * @param {PayloadAction<null | string>} action - The action containing the new token.
     */
    setToken: (state: authState, action: PayloadAction<null | string>) => {
      state.token = action.payload;
    },
    /**
     * Sets the user object.
     *
     * @param {authState} state - The current state.
     * @param {PayloadAction<object>} action - The action containing the new user object.
     */
    setUser: (state: authState, action: PayloadAction<object>) => {
      state.user = action.payload;
    },
    /**
     * Sets the message object.
     *
     * @param {authState} state - The current state.
     * @param {PayloadAction<Message>} action - The action containing the new message object.
     */
    setMessage: (state: authState, action: PayloadAction<Message>) => {
      state.message = action.payload;
    },
  },
});

export const {
  setIsAuthenticated,
  setIsAuthenticating,
  setIsCodeResend,
  setIsRegistered,
  setToken,
  setUser,
  setMessage,
} = authSlice.actions;
export default authSlice.reducer;
