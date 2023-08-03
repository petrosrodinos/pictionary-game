import { FC, useState, useEffect } from "react";
import Typography from "../../../components/ui/Typography";
import UsersGrid from "../../../components/UsersGrid";
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

interface WaitingRoomProps {}

const WaitingRoom: FC<WaitingRoomProps> = () => {
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
      if (roomInfo.status !== "waiting-room") {
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

  useEffect(() => {
    socket?.on("user-left", (room: any) => {
      setRoomInfo(room);
    });

    return () => {
      socket?.off("user-left");
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
          <UsersGrid users={roomInfo.players} />
          <RoomSettings roomInfo={roomInfo} />
        </>
      ) : (
        <Typography>Room does not exist or it is full :(</Typography>
      )}
      {countDownInSeconds > 0 && (
        <Button disabled={true} title={`GAME STARTING IN ${countDownInSeconds.toString()}`} />
      )}
    </div>
  );
};

export default WaitingRoom;
