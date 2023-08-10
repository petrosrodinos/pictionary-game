export interface Room {
  code: string;
  creator: string;
  maxPlayers: number;
  players: ConnectedUser[];
  drawings: any[];
  status: Status;
  word: string;
  round: number;
  currentArtist: ConnectedUser;
  roundTime: number;
  choosingWordTime: number;
  category: string;
  message: string;
}

export type Status =
  | "created"
  | "waiting-room"
  | "selecting-word"
  | "playing"
  | "finished"
  | "starting";

export interface ConnectedUser {
  userId: string;
  username: string;
  avatar: string;
  level?: number;
  points?: number;
}
