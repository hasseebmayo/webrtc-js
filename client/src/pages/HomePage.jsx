import { useEffect, useState } from "react";
import { useSocket } from "../utils/hooks/useSocket";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    roomId: "",
  });
  const { socket } = useSocket();
  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("join_room", data);
    setData({
      email: "",
      roomId: "",
    });
  };
  useEffect(() => {
    socket.on("joined_room", (roomiD) => {
      navigate(`/room/${roomiD}`);
      console.log("Joined using this room ID", roomiD);
    });
  }, [socket]);
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <form
        className="w-[40%] flex flex-col gap-[20px] bg-zinc-700 py-[50px] px-[20px] rounded"
        onSubmit={handleSubmit}
      >
        <h2 className="text-center text-white text-[30px]">
          Create or Join Room
        </h2>
        <input
          type="text"
          placeholder="Enter you email"
          value={data.email}
          className="border p-[5px] w-full rounded"
          onChange={(e) => {
            setData((p) => ({ ...p, email: e.target.value }));
          }}
        />
        <input
          type="text"
          placeholder="Join or create new room!"
          className="border p-[5px] w-full rounded"
          value={data.roomId}
          onChange={(e) => {
            setData((p) => ({ ...p, roomId: e.target.value }));
          }}
        />
        <button
          type="submit"
          className="p-[10px] bg-slate-600 rounded text-[#fff]"
        >
          Join or Create room
        </button>
      </form>
    </div>
  );
};

export default HomePage;
