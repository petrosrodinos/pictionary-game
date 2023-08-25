import { FC, useState, useEffect } from "react";
import Typography from "../../../components/ui/Typography";
import Button from "../../../components/ui/Button";
import { authStore } from "../../../store/authStore";
import PointsEarned from "./PointsEarned";
import Players from "../WaitingWord/Players";
import { UserToUpdate, UserType } from "../../../interfaces/typing";
import "./style.scss";
import { useMutation } from "react-query";
import { MAX_LEVEL, POINTS_PER_LEVEL } from "../../../constants/game";
import { updateUser } from "../../../services/user";

interface GameFinishedProps {
  players: UserType[];
  message?: string | null;
  onExit: () => void;
}

const GameFinished: FC<GameFinishedProps> = ({ message, players, onExit }) => {
  const [pointsEarned, setPointsEarned] = useState<number>(0);
  const [rank, setRank] = useState<number>(0);
  const { username, updateProfile, level, xp, userId } = authStore((state) => state);

  const { mutate: updateUserMutation } = useMutation((user: UserToUpdate) => {
    return updateUser(user);
  });

  useEffect(() => {
    updateUserInfo();
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

  const updateUserInfo = () => {
    let newPoints = xp + 5;
    let data = {};
    if (newPoints >= POINTS_PER_LEVEL && level < MAX_LEVEL) {
      newPoints = newPoints - POINTS_PER_LEVEL;
      data = { xp: newPoints, level: level + 1 };
    } else {
      data = { xp: newPoints };
    }
    updateUserMutation(
      {
        userId,
        game: {
          points: 5,
          rank: 2,
        },
        ...data,
      },
      {
        onSuccess: (data) => {
          console.log("updated", data);
          updateProfile({
            xp: data.xp,
            level: data.level,
          });
        },
      }
    );
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
