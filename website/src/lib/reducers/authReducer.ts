import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface Message {
  type: string,
  message: string
}

interface authState {
  isAuthenticated: boolean,
  isAuthenticating: boolean,
  isRegistered: boolean,
  isCodeResend: boolean,
  token: null | string
  user: object,
  message: Message
}

const initialState: authState = {
  isAuthenticated: false,
  isAuthenticating: false,
  isRegistered: false,
  isCodeResend: false,
  token: null,
  user: {},
  message:{
    type: "",
    message: ""
  },
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload
    },
    setIsAuthenticating: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticating = action.payload
    },
    setIsRegistered: (state, action: PayloadAction<boolean>) => {
      state.isRegistered = action.payload
    },
    setIsCodeResend: (state, action: PayloadAction<boolean>) => {
      state.isCodeResend = action.payload
    },
    setToken: (state, action: PayloadAction<null | string>) => {
      state.token = action.payload
    },
    setUser: (state, action: PayloadAction<object>) => {
      state.user = action.payload
    },
    setMessage: (state, action: PayloadAction<Message>) => {
      state.message = action.payload;
    }
  }
})

export const {
  setIsAuthenticated,
  setIsAuthenticating,
  setIsCodeResend,
  setIsRegistered,
  setToken,
  setUser,
  setMessage
} = authSlice.actions
export default authSlice.reducer