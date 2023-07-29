export interface Room {
  code: string;
  creator: string;
  players: number;
  rounds: number;
  users: ConnectedUser[];
  drawings: any[];
  status: Status;
  word: string;
  round: number;
  currentArtist: ConnectedUser;
  roundTime: number;
}

export type Status = "created" | "waiting" | "selecting-word" | "playing" | "finished";

export interface ConnectedUser {
  userId: string;
  username: string;
  avatar: string;
  level?: number;
  points?: number;
}
