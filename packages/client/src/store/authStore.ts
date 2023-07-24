import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { getRandomAvatar } from "../utils/avatar";

interface AuthState {
  isLoggedIn: boolean;
  token: string;
  userId: string;
  username: string;
  level: number;
  points: number;
  avatar: string;
  logOut: () => void;
  logIn: (payload: any) => void;
}

const initialStateValues = {
  isLoggedIn: false,
  token: "",
  username: "",
  userId: "",
  level: 0,
  points: 0,
  avatar: "",
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
            avatar: payload?.avatar || getRandomAvatar(),
          }),
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
