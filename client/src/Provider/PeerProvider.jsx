import { createContext, useEffect, useMemo, useState } from "react";

export const PeerContext = createContext();

// eslint-disable-next-line react/prop-types
export function PeerProvider({ children }) {
  const [remoteStream, setRemoteStream] = useState(null);

  const peer = useMemo(() => {
    return new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:global.stun.twilio.com:3478",
          ],
        },
      ],
    });
  }, []);

  const createOffer = async () => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return offer;
  };

  const createAnswer = async (offer) => {
    await peer.setRemoteDescription(offer);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    return answer;
  };

  const setRemoteAnswer = async (answer) => {
    await peer.setRemoteDescription(answer);
  };
  const sendStream = async (stream) => {
    stream.getTracks().forEach((track) => {
      peer.addTrack(track, stream);
    });
  };
  useEffect(() => {
    const handleStream = (event) => {
      const streams = event.streams;
      setRemoteStream(streams[0]);
    };

    peer.addEventListener("track", handleStream);
    return () => peer.removeEventListener("track", handleStream);
  }, [peer]);
  return (
    <PeerContext.Provider
      value={{
        peer,
        createOffer,
        createAnswer,
        sendStream,
        setRemoteAnswer,
        remoteStream,
      }}
    >
      {children}
    </PeerContext.Provider>
  );
}
