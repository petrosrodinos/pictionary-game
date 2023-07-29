import { FC } from "react";
import "./style.scss";
//import Typography from "../Typography";

interface AvatarProps {
  image: string;
  
}

const Avatar: FC<AvatarProps> = ({
 // error,
 image,

}) => {
 
  return (
  
      <img className="avatarImage" src={image} />
    
  ) 
  
};

export default Avatar;
