import axios from 'axios';
import { createAsyncThunk } from '@reduxjs/toolkit'
import { API } from "@/config/App.config";

// Import Reducers
import {
  setIsAuthenticated,
  setIsAuthenticating,
  setToken,
  setUser,
  setMessage,
  setIsRegistered,
  setIsCodeResend
} from '../reducers/authReducer'
import { getErrorMessage } from "@/lib/utils/error-utils";

// Register action
export const register = createAsyncThunk('auth/register', async (user: any, {dispatch}) => {

  // Set Is Authenticating `true`
  dispatch(setIsAuthenticating(true))

  // clear registration status
  dispatch(setIsRegistered(false))

  try {
    await axios.post(API.USER.BASE, user)

    // Registration success
    dispatch(setIsRegistered(true))

    // Set Is Authenticating `false`
    dispatch(setIsAuthenticating(false))
  } catch (err) {
    // Dispatch `authReducer` Values to Redux Store
    dispatch(setIsRegistered(false))
    dispatch(setMessage({type: "error", message: getErrorMessage(err)}))

    // Set Is Authenticating `false`
    dispatch(setIsAuthenticating(false))
  }
})

// Resend email action code
export const resendActivationCode = createAsyncThunk('auth/resendCode', async (user: any, {dispatch}) => {

  // Set Is Authenticating `true`
  dispatch(setIsAuthenticating(true))

  // clear activation code status
  dispatch(setIsCodeResend(false))

  try {
    await axios.post(API.OTP.RESEND, { userEmail: user['email'], otpUseCase: "AccountActivation" })

    // notify activation code success status
    dispatch(setIsCodeResend(true))

    // Set Is Authenticating `true`
    dispatch(setIsAuthenticating(false))
  } catch (err) {
    // Dispatch `authReducer` Values to Redux Store
    dispatch(setMessage({type: "error", message: getErrorMessage(err)}))

    // Set Is Authenticating `false`
    dispatch(setIsAuthenticating(false))
  }
})

// Login Action
export const login = createAsyncThunk('auth/login', async (user: any, {dispatch}) => {

  // Set Is Authenticating `true`
  dispatch(setIsAuthenticating(true))

  try {
    const res = await axios.post(API.AUTH.LOGIN, user)

    // If Error or Token Doesn't Exist
    if (!res?.data?.accessToken) {
      throw new Error('Token de acesso não recebido.')
    }

    const token = res.data.accessToken

    // Validate User By Token
    dispatch(validateUser(token))

  } catch (err) {
    // Dispatch `authReducer` Values to Redux Store
    dispatch(setIsAuthenticated(false))
    dispatch(setToken(null))
    dispatch(setUser({}))
    dispatch(setMessage({type: "error", message: getErrorMessage(err)}))

    // Set Is Authenticating `false`
    dispatch(setIsAuthenticating(false))
  }
})

// Validate User By Token
export const validateUser = createAsyncThunk('auth/validateUser', async (token: any, {dispatch}) => {

  // Set Is Authenticating `true`
  dispatch(setIsAuthenticating(true))

  try {
    // If Token Doesn't Exist
    if (!token) {
      throw new Error('Usuário não encontrado')
    }

    const res = await axios.get(API.USER.GET_USER, {headers: {Authorization: `Bearer ${token}`}})

    // If Error or User Doesn't Exist
    if (!res?.data) {
      throw new Error('Usuário não encontrado')
    }

    const user = res.data

    // Dispatch `authReducer` Values to Redux Store
    dispatch(setIsAuthenticated(true))
    dispatch(setToken(token))
    dispatch(setUser(user))

    // Set Is Authenticating `false`
    dispatch(setIsAuthenticating(false))

  } catch (err) {
    console.error(err)

    // Dispatch `authReducer` Values to Redux Store
    dispatch(setIsAuthenticated(false))
    dispatch(setToken(null))
    dispatch(setUser({}))

    // Set Is Authenticating `false`
    dispatch(setIsAuthenticating(false))
  }
})

// Logout Action
export const logout = createAsyncThunk('auth/logout', async (e, {dispatch}) => {

  // Set Is Authenticating `true`
  dispatch(setIsAuthenticating(true))

  // Clear localStorage
  localStorage.clear()

  // Dispatch `authReducer` Values to Redux Store
  dispatch(setIsAuthenticated(false))
  dispatch(setToken(null))
  dispatch(setUser({}))

  // Set Is Authenticating `false`
  dispatch(setIsAuthenticating(false))
})