import { FC } from "react";
import "./style.scss";

interface AvatarProps {
  image?: string;
  style?: React.CSSProperties;
  className?: string;
  onClick?: () => void;
}

const Avatar: FC<AvatarProps> = ({ image, style, className = "", onClick }) => {
  return (
    <img onClick={onClick} className={`avatar-image ${className}`} src={image} style={style} />
  );
};

export default Avatar;
