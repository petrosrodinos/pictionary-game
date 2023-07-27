export interface Room {
  code: string;
  creator: string;
  players: number;
  rounds: number;
  users: ConnectedUser[];
  drawings: any[];
  gameStarted: boolean;
  word: string;
  round: number;
}

export interface ConnectedUser {
  userId: string;
  username: string;
  avatar: string;
  level?: number;
  points?: number;
}
