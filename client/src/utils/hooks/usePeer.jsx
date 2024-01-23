import { useContext } from "react";
import { PeerContext } from "../../Provider/PeerProvider";

export function usePeer() {
  return useContext(PeerContext);
}
