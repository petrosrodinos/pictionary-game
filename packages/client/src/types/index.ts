import { Difficalty } from "../constants/game";

export type DifficaltyType = (typeof Difficalty)[keyof typeof Difficalty];
