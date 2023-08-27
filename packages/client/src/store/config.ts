import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface ConfigSettings {
  disabledSound: boolean;
  volume: number;
  colors: {
    primary: string;
    secondary: string;
  };
}

interface ConfigState {
  time: number;
  setTime: (payload: any) => void;
  config: ConfigSettings;
  setConfig: (payload: ConfigSettings) => void;
}

const initialStateValues = {
  time: 0,
  config: {
    disabledSound: false,
    volume: 0.5,
    colors: {
      primary: "#000000",
      secondary: "#ffffff",
    },
  },
};

export const configStore = create<ConfigState>()(
  devtools(
    persist(
      (set) => ({
        ...initialStateValues,
        setTime: (payload: any) =>
          set({
            time: payload.time,
          }),
        setConfig: (payload: ConfigSettings) =>
          set({
            config: payload,
          }),
      }),
      {
        name: "config-pictionary",
      }
    )
  )
);

export const getConfigState = (): ConfigState => {
  return configStore.getState();
};
