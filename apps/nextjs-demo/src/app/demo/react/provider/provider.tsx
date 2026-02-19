import { createContext, useContext } from 'react';
import { io as ioClient, type Socket } from 'socket.io-client';
export const DemoContext = createContext({
  isConnected: false,
  transport: 'N/A',
  io: null as IoClient | null,
});
export interface IoClient extends Socket {}

export const useDemo = () => {
  const c = useContext(DemoContext);
  if (!c) throw new Error('useDemo must be used within a DemoProvider');
  return c;
};
