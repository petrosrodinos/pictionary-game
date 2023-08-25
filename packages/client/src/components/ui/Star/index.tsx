import { FC } from "react";
import Typography from "../Typography";
import StarLevelImage from "../../../assets/star.png";
import "./style.scss";

interface StarProps {
  label: number;
  className?: string;
}

const Star: FC<StarProps> = ({ label, className }) => {
  return (
    <div className={`star-main-container ${className}`}>
      <img src={StarLevelImage} className="star-image" />

      <Typography
        style={label > 1 ? { left: "8px", top: "6px" } : { left: "14px", top: "5px" }}
        variant="text-accent"
        className="star-text"
      >
        {label}
      </Typography>
    </div>
  );
};

export default Star;
