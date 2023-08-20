import { FC, useState, useEffect } from "react";
import Typography from "../../../components/ui/Typography";
import Button from "../../../components/ui/Button";
import { authStore } from "../../../store/authStore";
import PointsEarned from "./PointsEarned";
import Players from "../WaitingWord/Players";
import { UserType } from "../../../interfaces/typing";
import "./style.scss";

interface GameFinishedProps {
  players: UserType[];
  message?: string | null;
  onExit: () => void;
}

const GameFinished: FC<GameFinishedProps> = ({ message, players, onExit }) => {
  const [pointsEarned, setPointsEarned] = useState<number>(0);
  const [rank, setRank] = useState<number>(0);
  const { username } = authStore((state) => state);

  useEffect(() => {
    const sortedUsers = players.sort((a, b) => b.points - a.points);
    const userRank = sortedUsers.findIndex((user) => user.username === username);
    setRank(userRank);
    setPointsEarned(sortedUsers[userRank].points);
  }, [players]);

  const division: any = {
    0: "LAST",
    1: "FIRST",
    2: "SECOND",
    3: "THIRD",
    4: "FOURTH",
    5: "FIFTH",
    6: "SIXTH",
    7: "SEVENTH",
    8: "EIGHTH",
    9: "NINTH",
    10: "TENTH",
  };

  return (
    <div className="game-finished-container">
      {message && <Typography variant="text-accent">{message}</Typography>}

      <Typography className="finish-message">
        <Typography className="msg-primary" variant="text-accent">
          CONGRATULATIONS -
        </Typography>{" "}
        <Typography className="msg-secondary">YOU CAME IN </Typography>
        <Typography className="msg-primary" variant="text-accent">
          {division?.[rank]}
        </Typography>
      </Typography>
      <Button style={{ maxWidth: "100px" }} onClick={onExit} title="EXIT" />
      <PointsEarned points={pointsEarned || 0} />
      <Players players={players} />
    </div>
  );
};

export default GameFinished;
