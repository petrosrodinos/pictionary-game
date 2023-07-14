import { useEffect, useState } from "react";

export const useTimer = (time: string, onTimerFinish: () => void) => {
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
        onTimerFinish();
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

  return {
    countDown,
  };
};
