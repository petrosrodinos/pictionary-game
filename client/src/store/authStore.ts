import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { ChipValue } from "../components/ui/ChipSelector";

interface AuthState {
  isLoggedIn: boolean;
  token: string;
  userId: string;
  username: string;
  level: number;
  xp: number;
  avatar: string;
  role: string;
  categories: ChipValue[];
  words: string;
  logOut: () => void;
  logIn: (payload: any) => void;
  updateProfile: (payload: any) => void;
}

const initialStateValues = {
  isLoggedIn: false,
  token: "",
  username: "",
  userId: "",
  level: 0,
  xp: 0,
  avatar: "",
  role: "",
  categories: [],
  words: "",
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
            xp: payload.xp,
            avatar: payload?.avatar,
            role: payload.role,
            categories: payload.categories.map((category: any) => {
              return { id: category._id, value: category.value };
            }),
            words: payload.words,
          }),
        updateProfile: (payload: any) =>
          set((state) => ({
            ...state,
            ...payload,
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
