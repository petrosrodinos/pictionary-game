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

export type ModalType = "choosing-word" | "waiting-word" | "game-finished" | "";

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
  const [activeModal, setActiveModal] = useState<keyof typeof ModalComponents>();
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
    socket.emit("get-info", roomId).on("send-info", (roomInfo: RoomInfo) => {
      console.log("get-info", roomInfo);
      setRoomInfo(roomInfo);
      setCurrentRound(roomInfo.round);
      setWord(roomInfo.word);
      setRounds(roomInfo.rounds);
      const artist = roomInfo.users[roomInfo.round];
      setArtist(artist);
      setCurrentUserIsPlaying(username === artist.username);
      console.log("op", chooseOption(), artist, username);
      setActiveModal(chooseOption());
    });

    return () => {
      socket.off("get-info");
    };
  }, [socket, roomId]);

  useEffect(() => {
    if (roomInfo.round === 1) {
    }
  }, [roomInfo]);

  const onRoundFinish = () => {
    setTimerFinish(true);
    setCurrentRound(currentRound + 1);
  };

  const handleWordSelected = (word: string) => {
    console.log(word);
    setCurrentRound(currentRound + 1);
    setTimerFinish(false);
    setWord(word);
    setArtist(roomInfo.users[currentRound + 1]);
  };

  const handleTimerFinish = () => {
    setTime(0);
  };

  const handleExit = () => {
    navigate("/home");
  };

  const ModalComponents = {
    "choosing-word": {
      component: (
        <ChoosingWord
          time={time}
          onTimerFinish={handleTimerFinish}
          onWordSelected={handleWordSelected}
          players={roomInfo.users}
        />
      ),
    },
    "waiting-word": {
      component: (
        <WaitingWord
          onTimerFinish={handleTimerFinish}
          time={time}
          artist={artist}
          players={roomInfo?.users}
        />
      ),
    },
    "game-finished": {
      component: <GameFinished onExit={handleExit} players={roomInfo?.users} />,
    },
  };

  function chooseTitle(): string {
    if (currentRound >= rounds && activeModal === "game-finished") return "GAME FINISHED";
    return currentRound === 1
      ? `ROUND ${currentRound} STARTED`
      : `ROUND ${currentRound}/${rounds} finished`;
  }

  function chooseOption(): keyof typeof ModalComponents {
    if (currentRound >= rounds) return "game-finished";

    return currentUserIsPlaying ? "choosing-word" : "waiting-word";
  }

  return (
    <>
      <Modal title={chooseTitle()} isOpen={timerFinish || currentRound === 1}>
        {ModalComponents[activeModal || "choosing-word"].component}
      </Modal>
      <div className="room-page-container">
        <button onClick={onRoundFinish}>finish</button>
        <div className="drawing-area-container">
          <Info
            onTimerFinish={onRoundFinish}
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
