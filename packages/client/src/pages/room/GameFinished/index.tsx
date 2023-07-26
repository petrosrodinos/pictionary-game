import { FC, useState, useEffect } from "react";
import Typography from "../../../components/ui/Typography";
import Button from "../../../components/ui/Button";
import UsersGrid from "../../../components/UsersGrid";
import { authStore } from "../../../store/authStore";
import PointsEarned from "./PointsEarned";
import "./style.scss";

interface GameFinishedProps {
  players: UserType[];
  onExit: () => void;
}

const GameFinished: FC<GameFinishedProps> = ({ players, onExit }) => {
  const [currentUserStats, setCurrentUserStats] = useState<UserType>();
  const { username } = authStore((state) => state);

  useEffect(() => {
    const user = players.find((player) => player.username === username);
    console.log("user", user);
    if (user) {
      setCurrentUserStats(user);
    }
  }, [players]);

  const division: any = {
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
      <Typography className="finish-message">
        <Typography className="msg-primary" variant="text-accent">
          CONGRATULATIONS -
        </Typography>{" "}
        <Typography className="msg-secondary">YOU CAME IN </Typography>
        <Typography className="msg-primary" variant="text-accent">
          {division?.[(Math.random() ** 100).toFixed(1) || 0]}
        </Typography>
      </Typography>
      <Button style={{ maxWidth: "100px" }} onClick={onExit} title="EXIT" />
      <PointsEarned points={currentUserStats?.points || 0} />
      <UsersGrid users={players} />
    </div>
  );
};

export default GameFinished;
