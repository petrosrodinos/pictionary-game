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
    const targetTime = new Date();
    const [hours, minutes] = time.split(":");
    targetTime.setHours(Number(hours));
    targetTime.setMinutes(Number(minutes));
    targetTime.setSeconds(0);

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetTime.getTime() - now;

      if (distance <= 0) {
        // Countdown is complete, perform necessary actions
        clearInterval(interval);
        setCountDown("00:00");
        // Additional logic here if needed
      } else {
        // Calculate remaining minutes and seconds
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
          2,
          "0"
        )}`;
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
