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
  avatar: string;
}

interface UserRegister {
  username: string;
  password: string;
  role: string;
  age: string;
  avatar: string;
  points?: number;
  level?: number;
}

interface UserToUpdate {
  username?: string;
  password?: string;
  role?: string;
  age?: string;
  avatar?: string;
  points?: number;
  level?: number;
  userId: string;
}

interface UserType {
  userId: number;
  avatar: string;
  username: string;
  xp?: number;
  games?: number;
  level: number;
  points: number;
}

interface GameSettings {
  maxPlayers: number;
  roundTime: number;
  choosingWordTime: number;
  category: string;
  code: string;
}

interface RoomInfo extends GameSettings {
  creator: string;
  players: UserType[];
  drawings: any[];
  word: string;
  round: number;
  currentArtist: UserType;
  status: string;
  message: string;
}
