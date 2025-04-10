import { useDispatch, useSelector, useStore } from "react-redux";

import type { AppDispatch, AppStore, RootState } from "./store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
/**
 * A typed version of the `useDispatch` hook from React-Redux.
 *
 * @type {AppDispatch} The type of the dispatch function for the application.
 * @returns {AppDispatch} A dispatch function with the application's specific type.
 *
 * @example
 * const dispatch = useAppDispatch();
 * dispatch(someAction());
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

/**
 * A typed version of the `useSelector` hook from React-Redux.
 *
 * @type {RootState} The type of the root state for the application.
 * @returns {RootState} The application's state with the specific type.
 *
 * @example
 * const someState = useAppSelector((state) => state.someReducer.someValue);
 */
export const useAppSelector = useSelector.withTypes<RootState>();

/**
 * A typed version of the `useStore` hook from React-Redux.
 *
 * @type {AppStore} The type of the store for the application.
 * @returns {AppStore} The application's store with the specific type.
 *
 * @example
 * const store = useAppStore();
 * console.log(store.getState());
 */
export const useAppStore = useStore.withTypes<AppStore>();
