import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface Message {
  type: string,
  message: string
}

interface TodoTask {
  id: number,
  userId: number,
  createdAt: string,
  updatedAt: string,
  name: string,
  description: string,
  status: string
}

interface SelectedStatus {
  name: string,
  value: string
}

interface todoTaskState {
  isLoading: boolean,
  message: Message,
  selectedStatus: SelectedStatus,
  tasks: TodoTask[]
}

const initialState: todoTaskState = {
  isLoading: false,
  selectedStatus: {
    name: "Todas",
    value: "All"
  },
  message: {
    type: "",
    message: ""
  },
  tasks: []
}

const taskSlice = createSlice({
  name: 'todoTask',
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setTasks: (state, action: PayloadAction<TodoTask[]>) => {
      state.tasks = action.payload
    },
    setMessage: (state, action: PayloadAction<Message>) => {
      state.message = action.payload;
    },
    setSelectedStatus: (state, action: PayloadAction<SelectedStatus>) => {
      state.selectedStatus = action.payload;
    },
  }
})

export const {
  setIsLoading,
  setTasks,
  setSelectedStatus,
  setMessage
} = taskSlice.actions
export default taskSlice.reducer