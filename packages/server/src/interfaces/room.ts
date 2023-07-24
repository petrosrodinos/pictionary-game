export interface Room {
  code: string;
  creator: string;
  players: number;
  rounds: number;
  users: ConnectedUser[];
  drawings: any[];
  gameStarted: boolean;
}

export interface ConnectedUser {
  userId: string;
  username: string;
  avatar: string;
  level?: number;
  rank?: number;
}
