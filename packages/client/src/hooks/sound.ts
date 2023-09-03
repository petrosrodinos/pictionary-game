import Click from "../assets/sounds/click.wav";
import GameStarting from "../assets/sounds/game-starting.wav";
import RoundFinished from "../assets/sounds/round-finished.mp3";
import Close from "../assets/sounds/close.mp3";
import WordFoundYou from "../assets/sounds/word-found-you.wav";
import WordFoundOthers from "../assets/sounds/word-found-others.wav";
import EnterWaitingRoom from "../assets/sounds/enter-waiting-room.mp3";
import InGame from "../assets/sounds/in-game.mp3";
import { configStore } from "../store/config";

type SoundKey =
  | "click"
  | "points-earned"
  | "game-starting"
  | "round-finished"
  | "close"
  | "word-found-you"
  | "word-found-others"
  | "in-game"
  | "enter-waiting-room";

export const sounds: Record<SoundKey, string> = {
  click: Click,
  "points-earned": WordFoundOthers,
  "game-starting": GameStarting,
  "round-finished": RoundFinished,
  "word-found-you": WordFoundYou,
  "word-found-others": WordFoundOthers,
  "in-game": InGame,
  "enter-waiting-room": EnterWaitingRoom,
  close: Close,
};

export const useSound = () => {
  const { disabledSound, volume } = configStore((state) => state.config);

  const play = (sound: SoundKey, config: { loop: boolean } = { loop: false }) => {
    if (disabledSound) return;
    const audio = new Audio(sounds[sound]);
    audio.volume = volume;
    audio.loop = config.loop;
    audio.play();
    return () => audio.pause();
  };

  return { play };
};
