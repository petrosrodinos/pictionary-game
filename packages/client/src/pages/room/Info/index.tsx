import { FC } from "react";
import Typography from "../../../components/ui/Typography";
import { useTimer } from "../../../hooks/timer";
import "./style.scss";

interface InfoProps {
  artist: string;
  time: string;
}

const Info: FC<InfoProps> = ({ artist, time }) => {
  const { countDown } = useTimer(time);

  return (
    <div className="info-container">
      <div className="artist-container">
        <Typography variant="text-accent" className="artist-label">
          ARTIST:
        </Typography>
        <Typography variant="small-text-main" className="artist-text">
          {artist}
        </Typography>
      </div>
      <div className="time-container">
        <Typography variant="text-accent" className="time-label">
          TIME:
        </Typography>
        <Typography variant="small-text-main" className="time-text">
          {countDown}
        </Typography>
      </div>
    </div>
  );
};

export default Info;
