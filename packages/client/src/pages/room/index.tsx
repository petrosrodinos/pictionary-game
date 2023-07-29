import { FC, useEffect, useState } from "react";
import Canvas from "./Canvas";
import { authStore } from "../../store/authStore";
import Info from "./Info";
import Modal from "../../components/ui/Modal";
import WaitingWord from "./WaitingWord";
import { getRandomAvatar } from "../../utils/avatar";
import { CHOOSING_WORD_TIME, ROUNDS } from "../../constants/game";
import ChoosingWord from "./ChoosingWord";
import GameFinished from "./GameFinished";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../hooks/socket";
import { useParams } from "react-router-dom";
import "./style.scss";

const Room: FC = () => {
  const { id: roomId } = useParams();
  const { username } = authStore((state) => state);
  const [roomInfo, setRoomInfo] = useState<RoomInfo>({} as RoomInfo);
  const [time, setTime] = useState<number>(CHOOSING_WORD_TIME);

  const [word, setWord] = useState<string>("");
  const [artist, setArtist] = useState<UserType>();
  const [rounds, setRounds] = useState<number>(ROUNDS);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [currentUserIsPlaying, setCurrentUserIsPlaying] = useState<boolean>(false);
  const [timerFinish, setTimerFinish] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<keyof typeof ModalComponents | "">();
  const { socket } = useSocket();
  const navigate = useNavigate();

  //test players
  const Players: UserType[] = [...new Array(5)].map((_, index) => ({
    userId: index + 1,
    username: `${username}${index !== 0 ? index : ""}`,
    points: index + 20,
    avatar: getRandomAvatar(),
    rank: index + 1,
  }));

  useEffect(() => {
    if (!socket) return;

    socket.emit("join-room", roomId);

    socket.on("send-info", (roomInfo: RoomInfo) => {
      console.log("get-info", roomInfo);
      setRoomData(roomInfo);
      setActiveModal(chooseOption(roomInfo.currentArtist.username));
    });

    return () => {
      socket.off("send-info");
    };
  }, [socket, roomId]);

  useEffect(() => {
    if (!socket) return;

    socket.on("word-changed", (roomInfo: RoomInfo) => {
      console.log("word-changed", roomInfo);
      setRoomInfo(roomInfo);
      setWord(roomInfo.word);

      setActiveModal("");
    });

    return () => {
      socket.off("word-changed");
    };
  }, [socket, roomId]);

  useEffect(() => {
    if (!socket) return;

    socket.on("time-finished", (roomInfo: RoomInfo) => {
      console.log("time-finished", roomInfo);
      setRoomInfo(roomInfo);
      setActiveModal(chooseOption(roomInfo.currentArtist.username));
    });

    return () => {
      socket.off("time-finished");
    };
  }, [socket, roomId]);

  useEffect(() => {
    if (!socket) return;

    socket.on("game-finished", (roomInfo: RoomInfo) => {
      console.log("game-finished", roomInfo);
      setRoomInfo(roomInfo);
      setActiveModal("game-finished");
    });

    return () => {
      socket.off("game-finished");
    };
  }, [socket, roomId]);

  const setRoomData = (roomInfo: RoomInfo) => {
    setRoomInfo(roomInfo);
    setRounds(roomInfo.rounds);
    setCurrentRound(roomInfo.round);
    setWord(roomInfo.word);
    setArtist(roomInfo.currentArtist);
    setCurrentUserIsPlaying(username === roomInfo.currentArtist.username);
    setActiveModal(chooseOption(roomInfo.currentArtist.username));
    // console.log("artist", artist.username, username);
  };

  const onRoundFinish = () => {
    setTimerFinish(true);
    setCurrentRound(currentRound + 1);
  };

  const handleWordSelected = (word: string) => {
    if (!socket) return;
    socket.emit("word-selected", roomId, word);
  };

  const handleTimerFinish = () => {
    // setTime(0);
  };

  const handleExit = () => {
    navigate("/home");
  };

  const ModalComponents = {
    "choosing-word": (
      <ChoosingWord
        time={time}
        onTimerFinish={handleTimerFinish}
        onWordSelected={handleWordSelected}
        players={roomInfo.users}
      />
    ),
    "waiting-word": (
      <WaitingWord
        onTimerFinish={handleTimerFinish}
        time={time}
        artist={roomInfo.currentArtist}
        players={roomInfo?.users}
      />
    ),
    "game-finished": <GameFinished onExit={handleExit} players={roomInfo?.users} />,
  };

  function chooseTitle(): string {
    if (roomInfo.round >= roomInfo?.users?.length && activeModal === "game-finished")
      return "GAME FINISHED";
    return `ROUND ${roomInfo.round}/${roomInfo.rounds} IS STARTING`;
  }

  function chooseOption(player: string): keyof typeof ModalComponents {
    // if (roomInfo.round >= roomInfo.rounds) return "game-finished";
    return player === username ? "choosing-word" : "waiting-word";
  }

  return (
    <>
      <Modal title={chooseTitle()} isOpen={!!activeModal}>
        {ModalComponents[activeModal || "choosing-word"]}
      </Modal>
      <div className="room-page-container">
        <button onClick={onRoundFinish}>finish</button>
        <div className="drawing-area-container">
          <Info
            timer={roomInfo.roundTime}
            artist={artist?.username || ""}
            choosingWord={timerFinish}
          />
          <Canvas word={word} currentUserIsPlaying={currentUserIsPlaying} />
        </div>
      </div>
    </>
  );
};

export default Room;
