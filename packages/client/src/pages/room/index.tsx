import { FC } from "react";
import Canvas from "./canvas";
import "./style.scss";

const Room: FC = () => {
  return (
    <div className="room-page-container">
      <Canvas />
    </div>
  );
};

export default Room;
