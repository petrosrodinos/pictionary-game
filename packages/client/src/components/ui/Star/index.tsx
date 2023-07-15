import { FC } from "react";
import Typography from "../Typography";
import "./style.scss";

interface StarProps {
  label: string | number;
  className?: string;
}

const Star: FC<StarProps> = ({ label, className }) => {
  return (
    <div className={`star-main-container ${className}`}>
      <Typography>{label}</Typography>
      <div className="temp">
        <div className="star-container"></div>
      </div>
    </div>
  );
};

export default Star;
