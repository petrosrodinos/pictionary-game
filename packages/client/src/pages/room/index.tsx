import { FC, useEffect, useState } from "react";
import Canvas from "./canvas";
import { authStore } from "../../store/authStore";
import Info from "./Info";
import Modal from "../../components/ui/Modal";
import WaitingWord from "./WaitingWord";
import { getRandomAvatar } from "../../utils/avatar";
import { CHOOSING_WORD_TIME, ROUNDS } from "../../constants/game";
import ChoosingWord from "./ChoosingWord";
import GameFinished from "./GameFinished";
import "./style.scss";

const Room: FC = () => {
  const { username } = authStore((state) => state);
  const [time, setTime] = useState<number>(CHOOSING_WORD_TIME);
  const [word, setWord] = useState<string>("");
  const [artist, setArtist] = useState<string>("");
  const [timer, setTimer] = useState<string>("00:00");
  const [rounds, setRounds] = useState<number>(ROUNDS);
  const [currentRound, setCurrentRound] = useState<number>(5);
  const [currentUserIsPlaying, setCurrentUserIsPlaying] = useState<boolean>(false);
  const [players, setPlayers] = useState<InGameUser[]>([]);
  const [timerFinish, setTimerFinish] = useState<boolean>(false);

  //test players
  const Players: InGameUser[] = [...new Array(5)].map((_, index) => ({
    id: index + 1,
    username: `${username}${index !== 0 ? index : ""}`,
    points: index + 20,
    avatar: getRandomAvatar(),
    rank: index + 1,
  }));

  //should get data from the socket connection first to set the settings
  useEffect(() => {
    console.log(Players);
    const artist = "rodinos";
    setTimer("05:00");
    setWord("carrot");
    setArtist(artist);
    setCurrentUserIsPlaying(username === artist);
    setPlayers(Players);
  }, []);

  const onTimerFinish = () => {
    setTimerFinish(true);
  };

  const handleWordSelected = () => {
    setCurrentRound(currentRound + 1);
    setTimerFinish(false);
    setTimer("05:00");
    setWord("carrot");
    setArtist(Players[currentRound + 1].username);
  };

  const handleExit = () => {
    console.log("exit");
  };

  const GameOptions = {
    "choosing-word": <ChoosingWord />,
    "waiting-word": <WaitingWord time={time} artist={Players[0]} players={players} />,
    "game-finished": <GameFinished onExit={handleExit} users={players} />,
  };

  const chooseOption = (): keyof typeof GameOptions => {
    if (currentRound >= rounds) return "game-finished";
    return currentUserIsPlaying ? "choosing-word" : "waiting-word";
  };

  return (
    <>
      <Modal title={`ROUND ${currentRound}/${rounds} finished`} isOpen={timerFinish}>
        {GameOptions[chooseOption()]}
      </Modal>
      <div className="room-page-container">
        <button onClick={onTimerFinish}>finish</button>
        <div className="drawing-area-container">
          <Info
            onTimerFinish={onTimerFinish}
            artist={artist}
            time={timer}
            choosingWord={timerFinish}
          />
          <Canvas word={word} currentUserIsPlaying={currentUserIsPlaying} />
        </div>
      </div>
    </>
  );
};

export default Room;
