import { FC } from "react";
import "./style.scss";
import Typography from "../../../../components/ui/Typography";
import Avatar from "../../../../components/ui/Avatar";
//import { authStore } from "../../../../store/authStore";

interface MessageBoxProps {
  value: string;
  style?: React.CSSProperties;
  className?: string;
  username: string;
  image: string;
  time: string;
}

const MessageBox: FC<MessageBoxProps> = ({
  image,
  username,
  value,
  style,
  className = "",
  time,
}) => {
  return (
    <div className={`message-box-container ${className}`} style={style}>
      <div className="message-box-left">
        <Typography
          variant="small-text-accent"
          className="message-box-username"
        >
          {username}
        </Typography>
        <Avatar className="message-box-avatar" image={image}></Avatar>
        <Typography variant="small-text-accent" className="message-box-time">
          {time}
        </Typography>
      </div>
      <div className="message-box-text-container">
        <Typography variant="text-accent" className="message-box-text">
          {value}
        </Typography>
      </div>
    </div>
  );
};

export default MessageBox;
