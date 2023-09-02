import { FC } from "react";
import { authStore } from "../../../../store/authStore";
import Typography from "../../../../components/ui/Typography";
import Star from "../../../../components/ui/Star";
import Loader from "../../../../components/ui/Loader";
import { POINTS_PER_LEVEL } from "../../../../constants/game";
import { useTranslation } from "react-i18next";
import "./style.scss";

interface PointsEarnedProps {
  points: number;
}

const PointsEarned: FC<PointsEarnedProps> = ({ points }) => {
  const { t } = useTranslation();
  const { level, xp: currentPoints } = authStore((state) => state);

  return (
    <div className="points-earned-container">
      <Typography className="points-label">
        {t("points-earned")}{" "}
        <Typography className="points-text" variant="text-accent">
          +{points}
        </Typography>
      </Typography>
      <div className="progress-container">
        <Star className="star-item-left" label={level} />
        <Loader max={POINTS_PER_LEVEL} value={currentPoints + points} />
        <Star className="star-item-right" label={level + 1} />
      </div>
    </div>
  );
};

export default PointsEarned;
