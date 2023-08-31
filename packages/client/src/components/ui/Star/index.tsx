import { FC } from "react";
import Typography from "../Typography";
import StarLevelImage from "../../../assets/icons/star.png";
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
        style={label <= 9 ? { left: "13px", top: "6px" } : { left: "9px", top: "6px" }}
        variant="text-accent"
        className="star-text"
      >
        {label}
      </Typography>
    </div>
  );
};

export default Star;
