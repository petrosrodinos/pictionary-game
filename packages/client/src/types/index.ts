import { Difficalty, WORDS } from "../constants/game";

export type DifficaltyType = (typeof Difficalty)[keyof typeof Difficalty];

export type CategoryType = keyof typeof WORDS;
