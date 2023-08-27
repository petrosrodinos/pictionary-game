import Click from "../assets/sounds/click.wav";
import PointsEarned from "../assets/sounds/points-earned.wav";
import GameStarting from "../assets/sounds/game-starting.wav";
import RoundFinished from "../assets/sounds/round-finished.mp3";
import Close from "../assets/sounds/close.mp3";
import { configStore } from "../store/config";
type SoundKey = "click" | "points-earned" | "game-starting" | "round-finished" | "close";

export const sounds: Record<SoundKey, string> = {
  click: Click,
  "points-earned": PointsEarned,
  "game-starting": GameStarting,
  "round-finished": RoundFinished,
  close: Close,
};

export const useSound = () => {
  const { disabledSound, volume } = configStore((state) => state.config);
  const play = (sound: SoundKey) => {
    if (disabledSound) return;
    const audio = new Audio(sounds[sound]);
    audio.volume = volume / 100;
    audio.play();
  };
  return { play };
};
