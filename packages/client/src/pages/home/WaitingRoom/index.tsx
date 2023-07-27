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
import { useNavigate } from "react-router-dom";
import { useTimer } from "../../../hooks/timer";
import { STARTING_TIME } from "../../../constants/game";
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
  const { countDownInSeconds, startCountDown } = useTimer("", startGame);
  const navigate = useNavigate();
  const { userId, username, avatar, level } = authStore((state) => state);
  const [roomInfo, setRoomInfo] = useState<RoomInfo>();
  const [searchParams, _] = useSearchParams();
  const { socket } = useSocket();

  //emits event when user joins waiting room and listens for when new user joins
  useEffect(() => {
    const waitingRoom = searchParams.get("waitingRoom");
    if (!waitingRoom || !socket) return;

    const joinedUser = {
      userId,
      username,
      avatar,
      level,
    };
    socket.emit("join-waiting-room", waitingRoom, joinedUser);
    socket.on("user-joined", (roomInfo: RoomInfo) => {
      console.log("user-joined", roomInfo);
      setRoomInfo(roomInfo);
      if (roomInfo.gameStarted) {
        // startGame();
      }
    });

    return () => {
      socket.off("user-joined");
    };
  }, [socket, searchParams]);

  //listening for when game starts and starts the timer
  useEffect(() => {
    if (!socket) return;

    socket.on("game-started", () => {
      startCountDown(STARTING_TIME);
    });

    return () => {
      socket.off("game-started");
    };
  }, [socket]);

  function startGame() {
    navigate(`/room/${searchParams.get("waitingRoom")}`);
  }

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
      {countDownInSeconds > 0 && (
        <Button
          disabled={true}
          title={`GAME STARTING IN ${countDownInSeconds.toString()}`}
          onClick={onLeave}
        />
      )}
    </div>
  );
};

export default WaitingRoom;
