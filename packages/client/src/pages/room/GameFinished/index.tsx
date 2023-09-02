import { FC, useState, useEffect, useRef } from "react";
import Typography from "../../../components/ui/Typography";
import Button from "../../../components/ui/Button";
import { authStore } from "../../../store/authStore";
import PointsEarned from "./PointsEarned";
import Players from "../WaitingWord/Players";
import { UserToUpdate, UserType } from "../../../interfaces/typing";
import { useMutation } from "react-query";
import { MAX_LEVEL, POINTS_PER_LEVEL } from "../../../constants/game";
import { updateUser } from "../../../services/user";
import { useSound } from "../../../hooks/sound";
import "./style.scss";

interface GameFinishedProps {
  players: UserType[];
  message?: string | null;
  onExit: () => void;
}

const GameFinished: FC<GameFinishedProps> = ({ message, players, onExit }) => {
  const updatedProfile = useRef(false);
  const [pointsEarned, setPointsEarned] = useState<number>(0);
  const [rank, setRank] = useState<number>(0);
  const { username, updateProfile, level, xp, userId } = authStore((state) => state);
  const { play } = useSound();

  const { mutate: updateUserMutation } = useMutation((user: UserToUpdate) => {
    return updateUser(user);
  });

  useEffect(() => {
    play("points-earned");
    updateUserInfo();
    const sortedUsers = players.sort((a, b) => b.points - a.points);
    const userRank = sortedUsers.findIndex((user) => user.username === username);
    setRank(userRank);
    setPointsEarned(sortedUsers[userRank].points);
  }, [players]);

  const division: any = {
    0: "FIRST",
    1: "SECOND",
    2: "THIRD",
    3: "FOURTH",
    4: "FIFTH",
    5: "SIXTH",
    6: "SEVENTH",
    7: "EIGHTH",
    8: "NINTH",
    9: "TENTH",
  };

  const updateUserInfo = () => {
    if (updatedProfile.current) return;
    updatedProfile.current = true;
    let newPoints = xp + pointsEarned;
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
          points: pointsEarned,
          rank: rank,
        },
        ...data,
      },
      {
        onSuccess: (data) => {
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
