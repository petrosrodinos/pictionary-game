import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { COLORS } from "../constants/colors";

interface ConfigSettings {
  disabledSound: boolean;
  volume: number;
  colors: any;
}

interface ConfigState {
  time: number;
  setTime: (payload: any) => void;
  config: ConfigSettings;
  setConfig: (payload: ConfigSettings) => void;
  resetColors: () => void;
}

const initialStateValues = {
  time: 0,
  config: {
    disabledSound: false,
    volume: 5,
    colors: COLORS,
  },
};

// for (const color in COLORS) {
//   root?.style?.setProperty(color, COLORS[color]);
// }

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
        resetColors: () => {
          set({
            config: {
              ...initialStateValues.config,
              colors: COLORS,
            },
          });
          setVariables();
        },
      }),
      {
        name: "config-pictionary",
      }
    )
  )
);

export function getConfigState() {
  return configStore.getState();
}

setVariables();

function setVariables() {
  var root: any = document.querySelector(":root");
  for (const color in getConfigState().config.colors) {
    root?.style?.setProperty(color, getConfigState().config.colors[color]);
  }
}
