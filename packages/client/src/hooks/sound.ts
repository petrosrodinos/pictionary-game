import Click from "../assets/sounds/click.wav";
import PointsEarned from "../assets/sounds/points-earned.wav";
import GameStarting from "../assets/sounds/game-starting.wav";

type SoundKey = "click" | "points-earned" | "game-starting";

export const useSound = () => {
  const sounds: Record<SoundKey, string> = {
    click: Click,
    "points-earned": PointsEarned,
    "game-starting": GameStarting,
  };

  const play = (sound: SoundKey) => {
    const audio = new Audio(sounds[sound]);
    audio.volume = 0.5;
    audio.play();
  };
  return { play };
};
