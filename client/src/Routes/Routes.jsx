import { Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Providers from "../Provider/Providers";
import Room from "../pages/Room";

const RoutesMain = () => {
  return (
    <Providers>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
    </Providers>
  );
};

export default RoutesMain;
