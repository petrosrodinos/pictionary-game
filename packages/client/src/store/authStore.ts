import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AuthState {
  isLoggedIn: boolean;
  token: string;
  userId: string;
  username: string;
  logOut: () => void;
  logIn: (payload: any) => void;
}

const initialStateValues = {
  isLoggedIn: false,
  token: "",
  username: "",
  userId: "",
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
