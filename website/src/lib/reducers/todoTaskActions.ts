
// Logout Action
import { createAsyncThunk } from "@reduxjs/toolkit";
import { setIsLoading, setTasks, setMessage } from "@/lib/reducers/todoTaskReducer";
import { RootState } from "@/lib/store";
import axios from "axios";
import { API } from "@/config/App.config";
import { getErrorMessage } from "@/lib/utils/error-utils";

export const listAllTasks = createAsyncThunk('todoTask/listAllTasks', async (e, {dispatch, getState}) => {
  dispatch(setIsLoading(true))

  try {
    const state = getState() as RootState
    const authState = state.auth;
    const taskState = state.task;

    const isAuthenticated = authState.isAuthenticated;
    const token = authState.token;

    const selectedStatus = taskState.selectedStatus.value;

    if (!isAuthenticated) {
      throw new Error("Você não fez login, faça login e tente novamente.");
    }

    if (!token) {
      throw new Error("O token de acesso é inválido.");
    }

    let tasks = [];
    if (selectedStatus === "Completed" || selectedStatus === "Pending") {
      const res = await axios.get(`${API.TODO_TASKS.ALL}/${selectedStatus}`, {headers: {Authorization: `Bearer ${token}`}})
      tasks = res.data;
    } else {
      const res = await axios.get(API.TODO_TASKS.ALL, {headers: {Authorization: `Bearer ${token}`}})
      tasks = res.data;
    }

    dispatch(setTasks(tasks));
    dispatch(setIsLoading(false))
  } catch (err) {
    dispatch(setIsLoading(false))
    dispatch(setTasks([]));
    dispatch(setMessage({type: "error", message: getErrorMessage(err)}));
  }
})

export const createNewTask = createAsyncThunk('todoTask/createNewTask', async (task: any, {dispatch, getState}) => {
  dispatch(setIsLoading(true))

  try {
    const state = getState() as RootState
    const authState = state.auth;

    const isAuthenticated = authState.isAuthenticated;
    const token = authState.token;

    if (!isAuthenticated) {
      throw new Error("Você não fez login, faça login e tente novamente.");
    }

    if (!token) {
      throw new Error("O token de acesso é inválido.");
    }

    await axios.post(API.TODO_TASKS.BASE, task, {headers: {Authorization: `Bearer ${token}`}})

    dispatch(listAllTasks())
  } catch (err) {
    dispatch(setIsLoading(false))
    dispatch(setTasks([]));
    dispatch(setMessage({type: "error", message: getErrorMessage(err)}));
  }
})

export const updateTask = createAsyncThunk('todoTask/createNewTask', async (task: any, {dispatch, getState}) => {
  dispatch(setIsLoading(true))

  try {
    const state = getState() as RootState
    const authState = state.auth;

    const isAuthenticated = authState.isAuthenticated;
    const token = authState.token;

    if (!isAuthenticated) {
      throw new Error("Você não fez login, faça login e tente novamente.");
    }

    if (!token) {
      throw new Error("O token de acesso é inválido.");
    }

    await axios.patch(API.TODO_TASKS.BASE, task, {headers: {Authorization: `Bearer ${token}`}})

    dispatch(listAllTasks())
  } catch (err) {
    dispatch(setIsLoading(false))
    dispatch(setTasks([]));
    dispatch(setMessage({type: "error", message: getErrorMessage(err)}));
  }
})

export const deleteTask = createAsyncThunk('todoTask/deleteTask', async (task: any, {dispatch, getState}) => {
  dispatch(setIsLoading(true))

  try {
    const state = getState() as RootState
    const authState = state.auth;

    const isAuthenticated = authState.isAuthenticated;
    const token = authState.token;

    if (!isAuthenticated) {
      throw new Error("Você não fez login, faça login e tente novamente.");
    }

    if (!token) {
      throw new Error("O token de acesso é inválido.");
    }

    await axios.delete(`${API.TODO_TASKS.BASE}/${task.id}`, {headers: {Authorization: `Bearer ${token}`}})

    dispatch(listAllTasks())
  } catch (err) {
    dispatch(setIsLoading(false))
    dispatch(setTasks([]));
    dispatch(setMessage({type: "error", message: getErrorMessage(err)}));
  }
})