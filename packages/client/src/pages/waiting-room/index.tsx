import { FC } from "react";

interface WaitingRoomProps {
  onLeave: () => void;
}

const WaitingRoom: FC<WaitingRoomProps> = ({ onLeave }) => {
  return <div>waitings</div>;
};

export default WaitingRoom;
