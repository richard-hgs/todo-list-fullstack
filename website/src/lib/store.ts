import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "@/lib/reducers/authReducer";
import todoTaskReducer from "@/lib/reducers/todoTaskReducer";

/**
 * Creates and configures the Redux store with persisted reducers.
 */
export function makeStore(
  // eslint-disable-next-line
  // @ts-ignore
  preloadedState?: ReturnType<ReturnType<typeof makeStore>["getState"]>
) {
  /**
   * Configuration for persisting the root reducer.
   * @type {import("redux-persist").PersistConfig}
   */
  const rootPersistConfig = {
    key: "root", // The key for the persisted state in storage
    keyPrefix: "redux-",
    storage, // The storage engine (localStorage in this case)
    version: 1, // Optional: Schema version, useful for migrations
    // Choose either whitelist or blacklist, usually not both.
    // If neither is specified, ALL state slices will be persisted.
    whitelist: [],
  };

  /**
   * Configuration for persisting the auth reducer.
   * @type {import("redux-persist").PersistConfig}
   */
  const authPersistConfig = {
    key: "auth",
    storage,
    keyPrefix: "redux-",
    whitelist: ["token", "user", "isAuthenticated"],
  };

  /**
   * Combines all reducers into a single root reducer.
   *
   * @type {import("redux").Reducer}
   */
  const rootReducer = combineReducers({
    auth: persistReducer(authPersistConfig, authReducer),
    task: todoTaskReducer,
  });

  /**
   * Wraps the root reducer with persistence capabilities.
   *
   * @type {import("redux").Reducer}
   */
  const persistedRootReducer = persistReducer(rootPersistConfig, rootReducer);

  /**
   * Configures the Redux store with the persisted root reducer and middleware.
   *
   * @type {import("redux").Store}
   */
  return configureStore({
    reducer: persistedRootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
    preloadedState,
  });
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
// Infer the type of the dispatch function from the store.
export type AppDispatch = AppStore["dispatch"];
