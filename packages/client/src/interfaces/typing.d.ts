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
  passwordConfirmation: string;
  email: string;
  role: string;
  age: string;
  avatar: string;
}

interface UserType {
  userId: number;
  avatar: string;
  username: string;
  rank?: number;
  xp?: number;
  games?: number;
  level?: number;
}

interface InGameUser {
  userId: number;
  avatar: string;
  username: string;
  points: number;
  rank: number;
}

interface GameSettings {
  players: number;
  rounds: number;
  code: string;
}

interface RoomInfo extends GameSettings {
  creator: string;
  users: UserType[];
  users?: any[];
  drawings?: any[];
  gameStarted?: boolean;
}
