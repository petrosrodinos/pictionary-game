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

interface UserRegister {
  username: string;
  password: string;
  role: string;
  age: string;
  avatar: string;
}

interface UserType {
  userId: number;
  avatar: string;
  username: string;
  xp?: number;
  games?: number;
  level?: number;
  points?: number;
}

// interface InGameUser {
//   userId: number;
//   username: string;
//   avatar: string;
//   points: number;
//   level?: number;
// }

interface GameSettings {
  players: number;
  rounds: number;
  code: string;
}

interface RoomInfo extends GameSettings {
  creator: string;
  users: UserType[];
  drawings?: any[];
  gameStarted?: boolean;
  word: string;
  round: number;
}
