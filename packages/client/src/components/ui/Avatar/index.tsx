import { FC } from "react";
import "./style.scss";

interface AvatarProps {
  image: string;
}

const Avatar: FC<AvatarProps> = ({ image }) => {
  return <img className="avatar-image" src={image} />;
};

export default Avatar;
