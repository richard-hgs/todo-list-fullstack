import { combineReducers, configureStore } from '@reduxjs/toolkit'
import authReducer from "@/lib/reducers/authReducer";
import todoTaskReducer from "@/lib/reducers/todoTaskReducer";
import {
  persistReducer,
  FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

export const makeStore = () => {
  const rootPersistConfig = {
    key: 'root',  // The key for the persisted state in storage
    keyPrefix : "redux-",
    storage,      // The storage engine (localStorage in this case)
    version: 1,   // Optional: Schema version, useful for migrations
    // Choose either whitelist or blacklist, usually not both.
    // If neither is specified, ALL state slices will be persisted.
    whitelist: [],
  }

  const authPersistConfig = {
    key      : 'auth',
    storage,
    keyPrefix : "redux-",
    whitelist: ["token", "user", "isAuthenticated"]
  }

  const rootReducer = combineReducers({
    auth: persistReducer(authPersistConfig, authReducer),
    task: todoTaskReducer
  });

  const persistedRootReducer = persistReducer(rootPersistConfig, rootReducer);

  return configureStore({
    reducer: persistedRootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']