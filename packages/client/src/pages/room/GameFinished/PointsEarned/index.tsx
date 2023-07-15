import { FC } from "react";
import { authStore } from "../../../../store/authStore";
import Typography from "../../../../components/ui/Typography";
import "./style.scss";
import Star from "../../../../components/ui/Star";

interface PointsEarnedProps {
  points: number;
}

const PointsEarned: FC<PointsEarnedProps> = ({ points }) => {
  const { level } = authStore((state) => state);

  return (
    <div className="points-earned-container">
      <Typography className="points-label">
        POINTS EARNED{" "}
        <Typography className="points-text" variant="text-accent">
          +{points}
        </Typography>
      </Typography>
      <div className="level-container">
        {/* <Star label={level} /> */}
        <div className="level-loader"></div>
        {/* <Star label={level + 1} /> */}
      </div>
    </div>
  );
};

export default PointsEarned;
