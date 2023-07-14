import { FC, useEffect, useState } from "react";
import Canvas from "./canvas";
import { authStore } from "../../store/authStore";
import Info from "./Info";
import Modal from "../../components/ui/Modal";
import WaitingWord from "./WaitingWord";
import { getRandomAvatar } from "../../utils/avatar";
import "./style.scss";

const Players: InGameUser[] = [...new Array(5)].map((_, index) => ({
  id: index + 1,
  username: "username" + index,
  points: index + 1,
  avatar: getRandomAvatar(),
}));

const Room: FC = () => {
  const { username } = authStore((state) => state);
  const [time, setTime] = useState<number>(1);
  const [word, setWord] = useState<string>("");
  const [artist, setArtist] = useState<string>("");
  const [timer, setTimer] = useState<string>("00:00");
  const [round, setRound] = useState<number>(1);
  const [currentUserIsPlaying, setCurrentUserIsPlaying] = useState<boolean>(false);
  const [players, setPlayers] = useState<InGameUser[]>([]);
  const [timerFinish, setTimerFinish] = useState<boolean>(false);

  useEffect(() => {
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
    setRound(round + 1);
    setTimerFinish(false);
    setTimer("05:00");
    setWord("carrot");
    setArtist(Players[round + 1].username);
  };

  return (
    <>
      <Modal isOpen={timerFinish}>
        <WaitingWord time={time} artist={Players[0]} round={round} players={players} />
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
