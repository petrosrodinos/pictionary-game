export const Statuses = {
  CREATED: "created",
  WAITING_ROOM: "waiting-room",
  SELECTING_WORD: "selecting-word",
  PLAYING: "playing",
  FINISHED: "finished",
} as const;

export type Statuses = (typeof Statuses)[keyof typeof Statuses];

export interface Room {
  code: string;
  creator: string;
  maxPlayers: number;
  players: ConnectedUser[];
  drawings: any[];
  status: Statuses;
  word: string;
  lastWord: string;
  round: number;
  currentArtist: ConnectedUser;
  roundTime: number;
  choosingWordTime: number;
  category: string;
  message: string;
  difficalty: string;
  chat: ConnectedUser[]
}

export type Status =
  | "created"
  | "waiting-room"
  | "selecting-word"
  | "playing"
  | "finished"
  | "starting";

export interface ConnectedUser {
  userId?: string;
  username?: string;
  avatar?: string;
  level?: number;
  points?: number;
  message?: string;
  time?: string;
}
