type Draw = {
  ctx: CanvasRenderingContext2D;
  currentPoint: Point;
  prevPoint: Point | null;
};

type Point = { x: number; y: number };

interface LeaderBoardItem {
  id: number;
  rank: number;
  avatar: string;
  username: string;
  xp: number;
  games: number;
}
