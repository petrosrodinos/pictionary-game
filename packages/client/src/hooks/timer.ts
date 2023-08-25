import { useEffect, useState } from "react";

export const useTimer = (time?: number | null, onTimerFinish?: () => void) => {
  const [countDown, setCountDown] = useState<string>("00:00");
  const [countDownInSeconds, setCountDownInSeconds] = useState<number>(0);

  useEffect(() => {
    if (!time) {
      setCountDown("00:00");
      return;
    }
    const countDownTime = time / 1000;

    let remainingTime = countDownTime;
    const interval = setInterval(() => {
      remainingTime--;

      if (remainingTime <= 0) {
        clearInterval(interval);
        setCountDown("00:00");
        setCountDownInSeconds(0);
        onTimerFinish?.();
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

  const startCountDown = (time: number) => {
    let timeLeft = time;
    const interval = setInterval(() => {
      timeLeft--;
      setCountDownInSeconds(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(interval);
        onTimerFinish?.();
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  };

  return {
    countDown,
    countDownInSeconds,
    startCountDown,
  };
};
