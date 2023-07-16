import { FC, useState, useEffect } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import { TEXT_SECONDARY } from "../../../constants/colors";
import "./style.scss";

interface LoaderProps {
  time: number;
  onFinish: () => void;
}

const Loader: FC<LoaderProps> = ({ time, onFinish }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    let timeToTimer = 0;
    const x = setInterval(() => {
      timeToTimer = timeToTimer + 1;
      setTimeLeft(timeToTimer);
      if (timeToTimer === time * 60) {
        onFinish();
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
        completed={timeLeft}
        maxCompleted={time * 60}
        transitionTimingFunction="linear"
      />
    </div>
  );
};

export default Loader;
