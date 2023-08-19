import { Difficalty, WORD_LIST } from "../constants/game";

export type DifficaltyType = (typeof Difficalty)[keyof typeof Difficalty];

export type CategoryType = keyof typeof WORD_LIST;
