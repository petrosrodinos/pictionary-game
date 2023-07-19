import { FC, useState, useEffect } from "react";
import Typography from "../../../components/ui/Typography";
import UsersGrid from "../../../components/UsersGrid";
import { getRandomAvatar } from "../../../utils/avatar";
import Button from "../../../components/ui/Button";
import { useSearchParams } from "react-router-dom";
import RoomSettings from "./RoomSettings";
import RoomInfo from "./RoomInfo";
import { useSocket } from "../../../hooks/socket";
import { authStore } from "../../../store/authStore";
import { io } from "socket.io-client";
import { API_URL } from "../../../constants";
import "./style.scss";

interface WaitingRoomProps {
  onLeave: () => void;
}

const TestUsers: UserType[] = [...new Array(5)].map((_, index) => ({
  userId: index,
  username: `username${index + 1}`,
  avatar: getRandomAvatar(),
  rank: index + 1,
  level: index + 1,
}));

const WaitingRoom: FC<WaitingRoomProps> = ({ onLeave }) => {
  // const { userId, username, avatar, level } = authStore((state) => state);
  const [roomInfo, setRoomInfo] = useState<RoomInfo>();
  const [searchParams, _] = useSearchParams();
  // const [socket, setSocket] = useState<any>();
  const { socket } = useSocket();
  // useEffect(() => {
  //   const s = io(`${API_URL}`);
  //   setSocket(s);

  //   return () => {
  //     s.disconnect();
  //   };
  // }, []);

  //useEffect detects for searchParams and getting the rooms info
  useEffect(() => {
    const waitingRoomCode = searchParams.get("waitingRoom");
    if (waitingRoomCode && socket) {
      console.log(":asdd", socket, waitingRoomCode);
      socket.emit("join-waiting-room", waitingRoomCode);
    }
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    socket.on("user-joined", (roomInfo: RoomInfo) => {
      // setRoomInfo(roomInfo);
      console.log("user-joined", roomInfo);
    });
    // setRoomInfo({
    //   creator: TestUsers[0].username,
    //   users: TestUsers,
    //   players: 5,
    //   rounds: 5,
    //   code: waitingRoomCode,
    // });
  }, [socket]);

  return (
    <div className="waiting-room-container">
      {roomInfo ? (
        <>
          <RoomInfo roomInfo={roomInfo} />
          <UsersGrid users={roomInfo.users} />
          <RoomSettings roomInfo={roomInfo} />
        </>
      ) : (
        <Typography>Room does not exist :(</Typography>
      )}
      <Button title="START" onClick={onLeave} />
    </div>
  );
};

export default WaitingRoom;
