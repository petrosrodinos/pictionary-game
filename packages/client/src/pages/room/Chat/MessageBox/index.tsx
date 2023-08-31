import { FC } from "react";
import "./style.scss";
import Typography from "../../../../components/ui/Typography";
import Avatar from "../../../../components/ui/Avatar";
//import { authStore } from "../../../../store/authStore";

interface MessageBoxProps {
  value: string;
  style?: React.CSSProperties;
  className: string;
  username: string;
  image: string;
  time: string;
}

const MessageBox: FC<MessageBoxProps> = ({
  image,
  username,
  value,
  style,
  className,
  time,
}) => {
  return (
    <div className={`player-${className}`} style={style}>
      <div className={`player-credentials-${className}`}>
        <Avatar className="message-box-avatar" image={image}></Avatar>
      </div>
      <div className="message-box-text-container">
        <Typography variant="small-text-main " className="message-box-username">
          {username}
        </Typography>
        <Typography variant="small-text-accent" className="message-box-text">
          {value}
        </Typography>
        <Typography variant="description-accent" className="message-box-time">
          {time}
        </Typography>
      </div>
    </div>
  );
};

export default MessageBox;
