import { FC } from "react";
import Typography from "../../../components/ui/Typography";
import { useTimer } from "../../../hooks/timer";
import { ROUND_TIME } from "../../../constants/game";
import "./style.scss";

interface InfoProps {
  artist: string;
  choosingWord: boolean;
  onTimerFinish: () => void;
}

const Info: FC<InfoProps> = ({ artist, choosingWord, onTimerFinish }) => {
  const { countDown } = useTimer(ROUND_TIME, onTimerFinish);

  return (
    <div className="info-container">
      <div className="artist-container">
        <Typography variant="text-accent" className="artist-label">
          ARTIST:
        </Typography>
        <Typography variant="small-text-main" className="artist-text">
          @{artist}
        </Typography>
      </div>
      <div className="time-container">
        <Typography variant="text-accent" className="time-label">
          TIME:
        </Typography>
        <Typography variant="small-text-main" className="time-text">
          {choosingWord ? "00:00" : countDown}
        </Typography>
      </div>
    </div>
  );
};

export default Info;
