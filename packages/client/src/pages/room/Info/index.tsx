import { FC, useState, useEffect } from "react";
import Typography from "../../../components/ui/Typography";
import "./style.scss";

interface InfoProps {
  artist: string;
  time: string;
}

const Info: FC<InfoProps> = ({ artist, time }) => {
  const [countDown, setCountDown] = useState<string>(time);

  useEffect(() => {
    const [minutes, seconds] = time.split(":").map(Number);
    const countDownTime = minutes * 60 + seconds;

    let remainingTime = countDownTime;
    const interval = setInterval(() => {
      remainingTime--;

      if (remainingTime <= 0) {
        clearInterval(interval);
        setCountDown("00:00");
      } else {
        const formattedTime = `${String(Math.floor(remainingTime / 60)).padStart(2, "0")}:${String(
          remainingTime % 60
        ).padStart(2, "0")}`;
        setCountDown(formattedTime);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [time]);

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
