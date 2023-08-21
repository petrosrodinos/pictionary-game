import { FC, useState, useEffect } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import { TEXT_SECONDARY } from "../../../constants/colors";
import "./style.scss";

interface LoaderProps {
  time?: number;
  value?: number;
  max?: number;
}

const Loader: FC<LoaderProps> = ({ time, value, max }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!time) return;
    let timeToTimer = 0;
    const x = setInterval(() => {
      timeToTimer = timeToTimer + 1000;
      setTimeLeft(timeToTimer);
      if (timeToTimer === time) {
        clearInterval(x);
      }
    }, 1000);
  }, []);

  return (
    <div className="loader-container">
      <ProgressBar
        isLabelVisible={false}
        bgColor={TEXT_SECONDARY}
        height="30px"
        completed={value || timeLeft}
        maxCompleted={max || time}
        transitionTimingFunction="linear"
      />
    </div>
  );
};

export default Loader;
