import { useParams } from "react-router-dom";
import { useSocket } from "../utils/hooks/useSocket";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePeer } from "../utils/hooks/usePeer";

// ... (other imports)

const Room = () => {
  const { socket } = useSocket();
  const { roomId } = useParams();

  const userRef = useRef();
  const remoteRef = useRef();
  const [stream, setStream] = useState();
  const {
    peer,
    createOffer,
    createAnswer,
    setRemoteAnswer,
    sendStream,
    remoteStream,
  } = usePeer();
  const [remoteEmail, setRemoteEmail] = useState();
  const handleNewlyJoinedUser = useCallback(
    async (email) => {
      console.log("Email of user:", email);
      const offer = await createOffer();
      setRemoteEmail(email);
      socket.emit("call-user", {
        email,
        offer,
      });
    },
    [createOffer, socket]
  );

  const handleIncomingCall = useCallback(async (data) => {
    const { from, offer } = data;

    console.log({
      from,
      offer,
    });

    // Set remote description first
    await setRemoteAnswer(offer);

    // Now create and send the answer
    const ans = await createAnswer(offer);
    socket.emit("call-accept", {
      email: from,
      answer: ans,
    });
  }, []);
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then((stream) => {
        console.log(stream);
        userRef.current.srcObject = stream;
        sendStream(stream);
      });
  }, []);

  const handleCallAccepted = useCallback(
    async (data) => {
      console.log("Call accepted==>", data);
      const { answer } = data;

      // Set the remote description with the received answer
      await setRemoteAnswer(answer);
    },
    [setRemoteAnswer]
  );

  useEffect(() => {
    socket.on("user_joined", handleNewlyJoinedUser);
    socket.on("incoming-call", handleIncomingCall);
    socket.on("call-accepted", handleCallAccepted);

    // Clean up event listeners when component unmounts
    return () => {
      socket.off("user_joined", handleNewlyJoinedUser);
      socket.off("incoming-call", handleIncomingCall);
      socket.off("call-accepted", handleCallAccepted);
    };
  }, [socket, handleNewlyJoinedUser, handleIncomingCall, handleCallAccepted]);
  useEffect(() => {
    const handleNegotiations = () => {
      const localDescription = peer.localDescription;
      socket.emit("call-user", {
        email: remoteEmail,
        offer: localDescription,
      });
    };
    peer.addEventListener("negotiationneeded", handleNegotiations);
    return () =>
      peer.removeEventListener("negotiationneeded", handleNegotiations);
  }, [peer]);
  useEffect(() => {
    if (remoteStream) {
      remoteRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);
  console.log(remoteStream);
  return (
    <div>
      <h2>You are connected to {remoteEmail}</h2>
      {roomId}
      <video autoPlay ref={userRef}></video>
      {<video autoPlay ref={remoteRef}></video>}
    </div>
  );
};

export default Room;
