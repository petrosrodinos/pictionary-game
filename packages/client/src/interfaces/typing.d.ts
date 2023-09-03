import { DifficaltyType } from "../types";

type Draw = {
  ctx: CanvasRenderingContext2D;
  currentPoint: Point;
  prevPoint: Point | null;
};

type Point = { x: number; y: number };

interface UserLogin {
  username: string;
  password: string;
}

interface NewUser {
  username: string;
  password: string | undefined;
  role: string;
  age: string;
  avatar?: string;
}

interface UserToUpdate {
  username?: string;
  password?: string;
  role?: string;
  age?: string;
  avatar?: string;
  xp?: number;
  level?: number;
  userId: string;
  game?: {
    points: number;
    rank: number;
  };
}

interface Game {
  date: string;
  points: number;
  rank: number;
}

interface UserType {
  userId: number;
  avatar: string;
  username: string;
  xp: number;
  games: Game[];
  level: number;
  points: number;
  connected?: boolean;
}

interface GameSettings {
  maxPlayers: number;
  roundTime: number;
  choosingWordTime: number;
  category: string;
  code: string;
  difficalty: DifficaltyType;
}

interface RoomInfo extends GameSettings {
  creator: string;
  players: UserType[];
  drawings: any;
  word: string;
  round: number;
  currentArtist: UserType;
  status: string;
  message: string;
  lastWord: string;
  chat: Message[];
}

export interface Message {
  userId: string;
  username: string;
  avatar: string;
  message: string;
  correct: boolean;
}
