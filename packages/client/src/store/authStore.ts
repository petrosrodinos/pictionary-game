import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
//import { getRandomAvatar } from "../utils/avatar";

interface AuthState {
  isLoggedIn: boolean;
  token: string;
  userId: string;
  username: string;
  level: number;
  points: number;
  avatar: string;
  inGamePoints: number;
  logOut: () => void;
  logIn: (payload: any) => void;
  addToInGamePoints: (payload: number) => void;
  clearInGamePoints: (payload: number) => void;
}

const initialStateValues = {
  isLoggedIn: false,
  token: "",
  username: "",
  userId: "",
  level: 0,
  points: 0,
  avatar: "",
  inGamePoints: 20,
};

export const authStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        ...initialStateValues,
        logOut: () => {
          set({
            ...initialStateValues,
          });
        },
        logIn: (payload: any) =>
          set({
            isLoggedIn: true,
            token: payload.token,
            userId: payload.userId,
            username: payload.username,
            level: payload.level,
            points: payload.points,
            avatar: payload?.avatar, //|| getRandomAvatar(),
          }),
        addToInGamePoints: (payload: number) =>
          set((state) => ({
            ...state,
            inGamePoints: state.inGamePoints + payload,
          })),
        clearInGamePoints: () =>
          set((state) => ({
            ...state,
            inGamePoints: 0,
          })),
      }),
      {
        name: "auth-pictionary",
      }
    )
  )
);

export const getAuthState = (): AuthState => {
  return authStore.getState();
};
