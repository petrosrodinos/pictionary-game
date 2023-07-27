import { FC } from "react";
import Typography from "../../../components/ui/Typography";
import Avatar from "../../../components/ui/Avatar";
import Loader from "../../../components/ui/Loader";
import Players from "./Players";
import "./style.scss";

interface WaitingWordsProps {
  artist: UserType | undefined;
  players: UserType[];
  time: number;
  onTimerFinish: () => void;
}

const WaitingWord: FC<WaitingWordsProps> = ({ artist, players, time, onTimerFinish }) => {
  return (
    <div className="waiting-word-container">
      <div className="artist-container">
        <Avatar image={artist?.avatar || ""} />
        <div className="column-2">
          <Typography variant="text-accent">@{artist?.username || ""}</Typography>
          <Typography>IS CHOOSING WORD</Typography>
        </div>
      </div>
      <Typography variant="text-main" className="waiting-label">
        WAITING FOR THE ARTIST TO CHOOSE A WORD
      </Typography>
      <Loader time={time} onFinish={onTimerFinish} />
      <Players players={players} />
    </div>
  );
};

export default WaitingWord;
