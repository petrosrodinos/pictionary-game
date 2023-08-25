import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface GameState {
  time: number;
  setTime: (payload: any) => void;
}

const initialStateValues = {
  time: 0,
};

export const gameStore = create<GameState>()(
  devtools(
    persist(
      (set) => ({
        ...initialStateValues,
        setTime: (payload: any) =>
          set({
            time: payload.time,
          }),
      }),
      {
        name: "game-pictionary",
      }
    )
  )
);

export const getGameState = (): GameState => {
  return gameStore.getState();
};
