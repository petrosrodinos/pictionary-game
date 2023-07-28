import { FC } from "react";
import "./style.scss";
import Typography from "../Typography";

interface AvatarProps {
  image: string;
  error?: string;
  value?: string;
}

const Avatar: FC<AvatarProps> = ({
  error,
  image,
  
}) => {
   
  return (
    <div className="avatar-container">
      <img className="avatar-image" src={image} />
      {error && <Typography className="input-error">{error}</Typography>}
    </div>
  ) 
  
};

export default Avatar;
