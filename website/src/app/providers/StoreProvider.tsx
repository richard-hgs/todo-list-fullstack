"use client";

import React, { useRef } from "react";

import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { Persistor } from "redux-persist/es/types";
import { PersistGate } from "redux-persist/integration/react";

import { AppStore, makeStore } from "@/lib/store";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);
  const persistorRef = useRef<Persistor | null>(null);
  if (!storeRef.current || !persistorRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
    persistorRef.current = persistStore(storeRef.current);
  }

  return (
    <Provider store={storeRef.current}>
      <PersistGate persistor={persistorRef.current}>{children}</PersistGate>
    </Provider>
  );
}
