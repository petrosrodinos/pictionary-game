import { FC } from "react";
import { authStore } from "../../../../store/authStore";
import Typography from "../../../../components/ui/Typography";
import Star from "../../../../components/ui/Star";
import "./style.scss";

interface PointsEarnedProps {
  points: number;
}

const PointsEarned: FC<PointsEarnedProps> = ({ points }) => {
  const { level, xp: currentPoints } = authStore((state) => state);

  return (
    <div className="points-earned-container">
      <Typography className="points-label">
        POINTS EARNED{" "}
        <Typography className="points-text" variant="text-accent">
          +{points}
        </Typography>
      </Typography>
      <div className="progress-container">
        <div
          style={{ width: `${currentPoints + points * 3.7}px` }}
          className="progress-loader"
        ></div>
        <Star className="star-item-left" label={level} />
        <Star className="star-item-right" label={level + 1} />
      </div>
    </div>
  );
};

export default PointsEarned;
