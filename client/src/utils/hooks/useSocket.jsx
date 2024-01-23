import { useContext } from "react";
import { SocketContext } from "../../Provider/SocketProvider";

export function useSocket() {
  return useContext(SocketContext);
}
