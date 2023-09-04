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
import { useTranslation } from "react-i18next";
import "./style.scss";

interface GameFinishedProps {
  players: UserType[];
  message?: string | null;
  onExit: () => void;
}

const GameFinished: FC<GameFinishedProps> = ({ message, players, onExit }) => {
  const { t } = useTranslation();
  const updatedProfile = useRef(false);
  const [pointsEarned, setPointsEarned] = useState<number>(0);
  const [rank, setRank] = useState<number>(0);
  const { username, updateProfile, level, xp, userId } = authStore((state) => state);
  const { play } = useSound();

  const { mutate: updateUserMutation } = useMutation(
    (user: UserToUpdate) => {
      return updateUser(user);
    },
    {
      onSuccess: (data: any) => {
        updateProfile({
          xp: data.xp,
          level: data.level,
        });
      },
    }
  );

  useEffect(() => {
    play("points-earned");
    const sortedUsers = players.sort((a, b) => b.points - a.points);
    const userRank = sortedUsers.findIndex((user) => user.username === username);
    setRank(userRank);
    setPointsEarned(sortedUsers[userRank].points);
    updateUserInfo(userRank + 1, sortedUsers[userRank].points);
  }, [players]);

  const division: any = {
    0: t("first"),
    1: t("second"),
    2: t("third"),
    3: t("fourth"),
    4: t("fifth"),
    5: t("sixth"),
    6: t("seventh"),
    7: t("eighth"),
    8: t("ninth"),
    9: t("tenth"),
  };

  const updateUserInfo = async (rank: number, points: number) => {
    if (updatedProfile.current) return;
    updatedProfile.current = true;
    let newPoints = xp + points;
    let data = {};
    if (newPoints >= POINTS_PER_LEVEL && level < MAX_LEVEL) {
      newPoints = newPoints - POINTS_PER_LEVEL;
      data = { xp: newPoints, level: level + 1 };
    } else {
      data = { xp: newPoints };
    }
    updateUserMutation({
      userId,
      game: {
        points,
        rank,
      },
      ...data,
    });
  };

  return (
    <div className="game-finished-container">
      {message && <Typography variant="text-accent">{message}</Typography>}

      <Typography className="finish-message">
        <Typography className="msg-primary" variant="text-accent">
          {t("congratulations")} -
        </Typography>{" "}
        <Typography className="msg-secondary">{t("you-came-in")} </Typography>
        <Typography className="msg-primary" variant="text-accent">
          {division?.[rank]}
        </Typography>
      </Typography>
      <Button style={{ maxWidth: "fit-content" }} onClick={onExit} title={t("exit")} />
      <PointsEarned points={pointsEarned || 0} />
      <Players players={players} />
    </div>
  );
};

export default GameFinished;
