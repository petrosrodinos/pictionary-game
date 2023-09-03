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
import { STARTING_TIME_IN_SECONDS } from "../../../constants/game";
import { RoomInfo as RoomInfoInt } from "../../../interfaces/typing";
import { useSound } from "../../../hooks/sound";
import { useTranslation } from "react-i18next";
import "./style.scss";
import { CLIENT_URL } from "../../../constants";

interface WaitingRoomProps {}

const WaitingRoom: FC<WaitingRoomProps> = () => {
  const { t } = useTranslation();
  const { play } = useSound();
  const navigate = useNavigate();
  const { countDownInSeconds, startCountDown } = useTimer(null, startGame);
  const { userId, username, avatar, level } = authStore((state) => state);
  const [roomInfo, setRoomInfo] = useState<RoomInfoInt>();
  const [searchParams, _] = useSearchParams();
  const { socket } = useSocket();

  useEffect(() => {
    socket?.on("user-joined", handleUserJoined);
    socket?.on("game-started", handleGameStarted);
    socket?.on("user-left", handleUserLeft);

    return () => {
      socket?.off("user-joined");
      socket?.off("game-started");
      socket?.off("user-left");
    };
  }, [socket]);

  //emits event when user joins waiting room and listens for when new user joins
  useEffect(() => {
    const waitingRoom = searchParams.get("room");
    if (!waitingRoom) return;

    const joinedUser = {
      userId,
      username,
      avatar,
      level,
    };
    navigator.clipboard.writeText(`${CLIENT_URL}home?room=${waitingRoom}`);
    socket?.emit("join-waiting-room", waitingRoom, joinedUser);
  }, [socket, searchParams]);

  const handleUserJoined = (roomInfo: RoomInfoInt) => {
    console.log("user-joined", roomInfo);
    play("enter-waiting-room");
    setRoomInfo(roomInfo);
  };

  const handleGameStarted = (roomInfo: RoomInfoInt) => {
    console.log("game-started", roomInfo);
    startCountDown(STARTING_TIME_IN_SECONDS);
  };

  const handleUserLeft = (room: RoomInfoInt) => {
    setRoomInfo(room);
  };

  const startGameByCreator = () => {
    socket?.emit("start-game", searchParams.get("room"));
  };

  function startGame() {
    play("game-starting");
    navigate(`/room/${searchParams.get("room")}`);
  }

  return (
    <div className="waiting-room-container">
      {roomInfo ? (
        <>
          <RoomInfo roomInfo={roomInfo} />
          <UsersGrid users={roomInfo.players} />
          <RoomSettings roomInfo={roomInfo} />
          {countDownInSeconds > 0 && (
            <Button
              className="waiting-room-button"
              disabled={true}
              title={`${t("game-starting-in")} ${countDownInSeconds.toString()}`}
            />
          )}
          {countDownInSeconds <= 0 &&
            roomInfo.players.length > 1 &&
            roomInfo.creator === userId &&
            roomInfo.status == "waiting-room" && (
              <Button
                className="waiting-room-button"
                onClick={startGameByCreator}
                title={t("start-game")}
              />
            )}
          {countDownInSeconds <= 0 && roomInfo.status != "waiting-room" && (
            <Button className="waiting-room-button" onClick={startGame} title={t("game-is-one")} />
          )}
        </>
      ) : (
        <Typography variant="sub-header-main">{t("room-doest-exist")}</Typography>
      )}
    </div>
  );
};

export default WaitingRoom;
