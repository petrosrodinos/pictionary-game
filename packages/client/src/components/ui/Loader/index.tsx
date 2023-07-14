import { FC, useState, useRef, useEffect } from "react";
import "./style.scss";

interface LoaderProps {
  time: number;
  onFinish: () => void;
}

const Loader: FC<LoaderProps> = ({ time, onFinish }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const intervalRef = useRef<any>(null);

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
      <div style={{ width: `${timeLeft * 1.7}%` }} ref={intervalRef} className="fill-bar"></div>
    </div>
  );
};

export default Loader;
