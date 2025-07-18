'use client';

import React, { ReactNode, createContext, useContext } from 'react';

interface AutoConnectContextValue {
  autoConnect: boolean;
  setAutoConnect: (autoConnect: boolean) => void;
}

const AutoConnectContext = createContext<AutoConnectContextValue>({
  autoConnect: false,
  setAutoConnect: () => {},
});

export function useAutoConnect(): AutoConnectContextValue {
  return useContext(AutoConnectContext);
}

export function AutoConnectProvider({ children }: { children: ReactNode }) {
  const [autoConnect, setAutoConnect] = React.useState(true);

  return (
    <AutoConnectContext.Provider value={{ autoConnect, setAutoConnect }}>
      {children}
    </AutoConnectContext.Provider>
  );
}
