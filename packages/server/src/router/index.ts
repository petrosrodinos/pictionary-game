import { trpc } from "../lib/trpc";
import { todoRouter } from "./todoRouter";
import { authRouter } from "./authRouter";

export const appRouter = trpc.router({
  todo: todoRouter,
  auth: authRouter,
});

export type AppRouter = typeof appRouter;
