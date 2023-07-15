import { FC } from "react";
import Typography from "../Typography";
import "./style.scss";

interface StarProps {
  label: string | number;
}

const Star: FC<StarProps> = ({ label }) => {
  return (
    <div className="star-main-container">
      <Typography>{label}</Typography>
      <div className="temp">
        <div className="star-container"></div>
      </div>
    </div>
  );
};

export default Star;
