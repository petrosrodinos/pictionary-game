import { useEffect, useState } from "react";

export const useTimer = (time: string | number, onTimerFinish: () => void) => {
  const [countDown, setCountDown] = useState<string>("00:00");
  const [countDownInSeconds, setCountDownInSeconds] = useState<number>(0);

  useEffect(() => {
    let minutes, seconds;
    if (typeof time === "string") {
      const splitted = time.split(":").map(Number);
      minutes = splitted[0];
      seconds = splitted[1];
    } else {
      minutes = time;
      seconds = time % 60;
    }
    const countDownTime = minutes * 60 + seconds;

    let remainingTime = countDownTime;
    const interval = setInterval(() => {
      remainingTime--;

      if (remainingTime <= 0) {
        clearInterval(interval);
        setCountDown("00:00");
        setCountDownInSeconds(0);
        onTimerFinish();
      } else {
        setCountDownInSeconds(remainingTime);
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

  return {
    countDown,
    countDownInSeconds,
  };
};
