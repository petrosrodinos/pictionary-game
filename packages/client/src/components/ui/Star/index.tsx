import { FC } from "react";
import Typography from "../Typography";
import StarLevelImage from "../../../assets/player-level-star.png";
import "./style.scss";

interface StarProps {
  label: string | number;
  className?: string;
}

const Star: FC<StarProps> = ({ label, className }) => {
  return (
    // <div className={`star-main-container ${className}`}>
    //   <Typography>{label}</Typography>
    //   <div className="temp">
    //     <div className="star-container"></div>
    //   </div>
    // </div>
    <div className={`star-main-container ${className}`}>
      <img src={StarLevelImage} className="star-image" />

      <Typography variant="text-accent" className="star-text">
        {label}
      </Typography>
    </div>
  );
};

export default Star;
