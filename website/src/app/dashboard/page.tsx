"use client"

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import {
  createNewTask,
  listAllTasks,
  updateTask,
  deleteTask as deleteTaskAction
} from "@/lib/reducers/todoTaskActions";
import LoadingPopup from "@/components/popups/LoadingPopup";
import { CheckIcon, TrashIcon } from "@heroicons/react/24/solid";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/16/solid";
import { setSelectedStatus } from "@/lib/reducers/todoTaskReducer";
import { validateUser, logout as logoutUser } from "@/lib/reducers/authActions";
import ErrorPopup from "@/components/popups/ErrorPopup";

const status = [
  {
    name: "Todas",
    value: "All"
  },
  {
    name: "Pendente",
    value: "Pending"
  },
  {
    name: "Completas",
    value: "Completed"
  },
];

function Dashboard() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Get Data from Redux Store
  const isAuthenticated = useAppSelector(state => state?.auth?.isAuthenticated ?? false)
  const token = useAppSelector(state => state?.auth?.token ?? null)
  const isLoading = useAppSelector(state => state?.task?.isLoading ?? false)
  const tasks = useAppSelector(state => state?.task?.tasks ?? [])
  const actionMessage = useAppSelector(state => state?.task?.message ?? {type: null, message: null})
  const selectedStatus = useAppSelector(state => state?.task?.selectedStatus ?? status[0])
  const [newTask, setNewTask] = useState('')
  const [error, setError] = useState({
    open: false,
    message: ""
  });

  React.useEffect(() => {
    if (!isAuthenticated) {
      // Return to sign-in screen since user is not signed-in
      router.replace("/")
    }
  }, [isAuthenticated]);

  React.useEffect(() => {
    dispatch(validateUser(token))
    dispatch(listAllTasks());
  }, []);

  React.useEffect(() => {
    if (actionMessage.type === "error") {
      setError({...error, open: true, message: actionMessage.message})
    }
  }, [actionMessage]);

  const addTask = () => {
    if (newTask.trim()) {
      dispatch(createNewTask({
        name       : newTask,
        description: newTask,
      }));
      setNewTask('');
    }
  };

  const toggleTaskCompletion = (index: number) => {
    const taskAt = tasks[index];
    dispatch(updateTask({...taskAt, status: taskAt.status === "Completed" ? "Pending" : "Completed" }))
  };

  const deleteTask = (index: number) => {
    const taskAt = tasks[index];
    dispatch(deleteTaskAction(taskAt))
  };

  const setStatus = (status: any) => {
    dispatch(setSelectedStatus(status))
    dispatch(listAllTasks())
  }

  /**
   * The logout is performed only in the front-end, the token can still be used
   * In the future the logout request on the server should be implemented
   */
  const logout = () => {
    dispatch(logoutUser())
  }

  return (
    <div className={"h-screen w-screen flex items-center justify-center"}>
      <div className={"flex flex-col"}>
        <div className="max-w-md mx-auto md:w-300 p-4 bg-gray-600 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4">Lista de tarefas</h1>
          <div className="flex mb-4">
            <input
              type="text"
              className="flex-1 p-2 border rounded"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Nova tarefa..."
            />
            <button
              onClick={addTask}
              className="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
            >
              Add
            </button>
          </div>
          <Listbox value={selectedStatus} onChange={setStatus}>
            <div className="relative mt-2">
              <ListboxButton className="grid w-full cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6">
              <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
                <span className="block truncate">{selectedStatus.name}</span>
              </span>
                <ChevronUpDownIcon
                  aria-hidden="true"
                  className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                />
              </ListboxButton>

              <ListboxOptions
                transition
                className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
              >
                {status.map((status) => (
                  <ListboxOption
                    key={status.value}
                    value={status}
                    className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-blue-600 data-focus:text-white data-focus:outline-hidden"
                  >
                    <div className="flex items-center">
                      <span className="ml-3 block truncate font-normal group-data-selected:font-semibold">{status.name}</span>
                    </div>

                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600 group-not-data-selected:hidden group-data-focus:text-white">
                    <CheckIcon aria-hidden="true" className="size-5" />
                  </span>
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </div>
          </Listbox>
          <ul className={"mt-4"}>
            {tasks.map((task, index) => (
              <li key={index} className="flex justify-between items-center mb-2">
              <span
                className={`flex-1 ${task.status === "Completed" ? 'line-through text-gray-300' : ''}`}>
                {task.name}
              </span>
                <button
                  onClick={() => toggleTaskCompletion(index)}
                  className="ml-4 p-1 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
                >
                  <CheckIcon aria-hidden="true" className="size-6 text-white-600" />
                </button>
                <button
                  onClick={() => deleteTask(index)}
                  className="ml-4 p-1 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
                >
                  <TrashIcon aria-hidden="true" className="size-6 text-white-600" />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => logout()}
          className="mt-2 p-2 flex-1 bg-red-800 text-white rounded hover:bg-red-700 cursor-pointer"
        >
          Deslogar
        </button>
      </div>

      <ErrorPopup
        open={error.open}
        message={error.message}
        setOpen={(newOpen) => setError({...error, open: newOpen})}
      />

      <LoadingPopup open={isLoading}/>
    </div>
  )
}

export default Dashboard;