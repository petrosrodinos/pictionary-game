import { FC, useEffect, useState } from "react";
import Canvas from "./canvas";
import { authStore } from "../../store/authStore";
import Typography from "../../components/ui/Typography";
import Info from "./Info";
import "./style.scss";

const Room: FC = () => {
  const { username } = authStore((state) => state);
  const [word, setWord] = useState<string>("");
  const [artist, setArtist] = useState<string>("");
  const [time, setTime] = useState<string>("10:00");
  const [round, setRound] = useState<number>(1);
  const [players, setPlayers] = useState<string[]>([]);

  useEffect(() => {
    setWord("carrot");
    setArtist("rodinos");
  }, []);

  return (
    <div className="room-page-container">
      <div className="drawing-area-container">
        <Info artist={artist} time={time} />
        <Canvas word={word} artistIsPlaying={artist === username} />
      </div>
    </div>
  );
};

export default Room;
