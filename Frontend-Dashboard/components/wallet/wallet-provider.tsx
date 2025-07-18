'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Mock wallet context for now
interface MockWalletContextType {
  connected: boolean;
  connecting: boolean;
  account: any;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const MockWalletContext = createContext<MockWalletContextType>({
  connected: false,
  connecting: false,
  account: null,
  connect: async () => {},
  disconnect: async () => {},
});

export const useWallet = () => useContext(MockWalletContext);

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [account, setAccount] = useState<any>(null);

  const connect = async () => {
    setConnecting(true);
    // Mock connection delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setConnected(true);
    setAccount({ address: '0x1234...abcd' });
    setConnecting(false);
  };

  const disconnect = async () => {
    setConnected(false);
    setAccount(null);
  };

  return (
    <MockWalletContext.Provider value={{
      connected,
      connecting,
      account,
      connect,
      disconnect,
    }}>
      {children}
    </MockWalletContext.Provider>
  );
}
