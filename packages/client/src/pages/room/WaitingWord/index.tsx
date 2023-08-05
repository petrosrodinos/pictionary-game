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
  message?: { message: string; data: any };
}

const WaitingWord: FC<WaitingWordsProps> = ({ artist, players, time, message }) => {
  return (
    <div className="waiting-word-container">
      <div className="artist-container">
        <Avatar image={artist?.avatar || ""} />
        <div className="column-2">
          <Typography className="artist-label" variant="text-accent">
            @{artist?.username || ""}
          </Typography>
          {!message && <Typography>IS CHOOSING WORD</Typography>}
          {message && (
            <>
              <Typography variant="text-accent">{message.message}</Typography>
              <Typography className="artist-label" variant="text-accent">
                {message?.data}
              </Typography>
            </>
          )}
        </div>
      </div>
      <Typography variant="text-main" className="waiting-label">
        WAITING FOR THE ARTIST TO CHOOSE A WORD
      </Typography>
      <Loader time={time} />
      <Players players={players} />
    </div>
  );
};

export default WaitingWord;
