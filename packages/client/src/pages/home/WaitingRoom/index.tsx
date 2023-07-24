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
import "./style.scss";

interface WaitingRoomProps {
  onLeave: () => void;
  // roomInfo: RoomInfo | undefined;
}

const TestUsers: UserType[] = [...new Array(5)].map((_, index) => ({
  userId: index,
  username: `username${index + 1}`,
  avatar: getRandomAvatar(),
  rank: index + 1,
  level: index + 1,
}));

const WaitingRoom: FC<WaitingRoomProps> = ({ onLeave }) => {
  const { userId, username, avatar, level } = authStore((state) => state);
  const [roomInfo, setRoomInfo] = useState<RoomInfo>();
  const [searchParams, _] = useSearchParams();
  const { socket } = useSocket();

  useEffect(() => {
    const waitingRoom = searchParams.get("waitingRoom");
    if (waitingRoom && socket) {
      const joinedUser = {
        userId,
        username,
        avatar,
        level,
      };
      socket
        .emit("join-waiting-room", waitingRoom, joinedUser)
        .on("user-joined", (roomInfo: RoomInfo) => {
          console.log("user-joined-waiting", roomInfo);
          setRoomInfo(roomInfo);
        });
    }
  }, [searchParams, socket]);

  // useEffect(() => {
  //   if (!socket) return;
  //   socket.on("user-joined", (roomInfo: RoomInfo) => {
  //     console.log("user-joined-waiting", roomInfo);
  //   });

  //   // return () => {
  //   //   socket.off("user-joined");
  //   // };
  // }, [socket, searchParams]);

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
