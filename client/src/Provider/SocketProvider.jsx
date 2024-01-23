import { createContext } from "react";

export const SocketContext = createContext(null);
import socket from "../utils/sockt/socket";
// eslint-disable-next-line react/prop-types
export function SocketProvider({ children }) {
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}
