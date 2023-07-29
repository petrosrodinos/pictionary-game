import { FC } from "react";
import "./style.scss";
//import Typography from "../Typography";

interface AvatarProps {
  image?: string;
  style?: React.CSSProperties;
  className?: string;
}

const Avatar: FC<AvatarProps> = ({
  // error,
  image,
  style,
  className = "",
}) => {
  return (
    <div className={`avatarIcon ${className}`}>
      <img className="avatarImage" src={image} style={style} />
    </div>
  );
};

export default Avatar;
