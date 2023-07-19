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
import "./style.scss";

const Room: FC = () => {
  const { username } = authStore((state) => state);
  const [time, setTime] = useState<number>(CHOOSING_WORD_TIME);
  const [word, setWord] = useState<string>("");
  const [words, setWords] = useState<string[]>([]);
  const [artist, setArtist] = useState<string>("");
  const [timer, setTimer] = useState<string>("00:00");
  const [rounds, setRounds] = useState<number>(ROUNDS);
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [currentUserIsPlaying, setCurrentUserIsPlaying] = useState<boolean>(false);
  const [players, setPlayers] = useState<InGameUser[]>([]);
  const [timerFinish, setTimerFinish] = useState<boolean>(false);
  const navigate = useNavigate();

  //test players
  const Players: InGameUser[] = [...new Array(5)].map((_, index) => ({
    userId: index + 1,
    username: `${username}${index !== 0 ? index : ""}`,
    points: index + 20,
    avatar: getRandomAvatar(),
    rank: index + 1,
  }));

  //should get data from the socket connection first to set the settings
  useEffect(() => {
    const artist = "rodinos";
    setTimer("05:00");
    setWord("carrot");
    setArtist(artist);
    setCurrentUserIsPlaying(username === artist);
    setPlayers(Players);
    setWords(["carrot", "apple", "banana", "orange", "pineapple"]);
  }, []);

  const onRoundFinish = () => {
    setTimerFinish(true);
  };

  const handleWordSelected = (word: string) => {
    console.log(word);
    setCurrentRound(currentRound + 1);
    setTimerFinish(false);
    setTimer("05:00");
    setWord(word);
    setArtist(players[currentRound + 1].username);
  };

  const handleExit = () => {
    navigate("/home");
  };

  const handleTimerFinish = () => {
    setTime(0);
  };

  const ModalComponents = {
    "choosing-word": {
      title: `ROUND ${currentRound}/${rounds} finished`,
      component: (
        <ChoosingWord
          time={time}
          words={words}
          onTimerFinish={handleTimerFinish}
          onWordSelected={handleWordSelected}
          players={players}
        />
      ),
    },
    "waiting-word": {
      title: `ROUND ${currentRound}/${rounds} finished`,
      component: (
        <WaitingWord
          onTimerFinish={handleTimerFinish}
          time={time}
          artist={players[0]}
          players={players}
        />
      ),
    },
    "game-finished": {
      title: "GAME FINISHED",
      component: <GameFinished onExit={handleExit} users={players} />,
    },
  };

  const chooseOption = (): keyof typeof ModalComponents => {
    if (currentRound >= rounds) return "game-finished";
    return currentUserIsPlaying ? "choosing-word" : "waiting-word";
  };

  return (
    <>
      <Modal title={ModalComponents[chooseOption()].title} isOpen={timerFinish}>
        {ModalComponents[chooseOption()].component}
      </Modal>
      <div className="room-page-container">
        <button onClick={onRoundFinish}>finish</button>
        <div className="drawing-area-container">
          <Info
            onTimerFinish={onRoundFinish}
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
