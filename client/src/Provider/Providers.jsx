import { SocketProvider } from "./SocketProvider";
import { PeerProvider } from "./PeerProvider";
// eslint-disable-next-line react/prop-types
const Providers = ({ children }) => {
  return (
    <SocketProvider>
      <PeerProvider>{children}</PeerProvider>
    </SocketProvider>
  );
};

export default Providers;
