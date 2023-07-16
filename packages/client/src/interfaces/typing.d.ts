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

interface UserType {
  id: number;
  rank?: number;
  avatar: string;
  username: string;
  xp?: number;
  games?: number;
  level?: number;
}

interface InGameUser {
  id: number;
  avatar: string;
  username: string;
  points: number;
  rank: number;
}

interface GameSettings {
  players: number;
  rounds: number;
}

interface RoomInfo {
  creator: string;
  code: string;
  settings: GameSettings;
  users: UserType[];
}
