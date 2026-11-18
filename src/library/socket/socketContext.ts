import { createContext, useContext } from 'react';
import type { AppSocket } from './events';

export interface SocketContextValue {
  socket: AppSocket | null;
  isConnected: boolean;
}

export const SocketContext = createContext<SocketContextValue>({ socket: null, isConnected: false });

export const useSocket = () => useContext(SocketContext);
