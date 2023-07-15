import { FC, useState, useEffect } from "react";
import Typography from "../../../components/ui/Typography";
import Button from "../../../components/ui/Button";
import UsersGrid from "../../../components/UsersGrid";
import { authStore } from "../../../store/authStore";
import PointsEarned from "./PointsEarned";
import "./style.scss";

interface GameFinishedProps {
  users: InGameUser[];
  onExit: () => void;
}

const GameFinished: FC<GameFinishedProps> = ({ users, onExit }) => {
  const [currentUserStats, setCurrentUserStats] = useState<InGameUser>();
  const { username } = authStore((state) => state);

  useEffect(() => {
    const user = users.find((user) => user.username === username);
    console.log("user", user);
    if (user) {
      setCurrentUserStats(user);
    }
  }, [users]);

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
          {division?.[currentUserStats?.rank || 0]}
        </Typography>
      </Typography>
      <Button style={{ maxWidth: "100px" }} onClick={onExit} title="EXIT" />
      <PointsEarned points={currentUserStats?.points || 0} />
      <UsersGrid users={users} />
    </div>
  );
};

export default GameFinished;
