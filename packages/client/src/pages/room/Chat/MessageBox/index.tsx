import { FC } from "react";
import Typography from "../../../../components/ui/Typography";
import Avatar from "../../../../components/ui/Avatar";
import "./style.scss";

interface MessageBoxProps {
  value: string;
  style?: React.CSSProperties;
  className: string;
  username: string;
  image: string;
  time: string;
}

const MessageBox: FC<MessageBoxProps> = ({ image, username, value, style, className, time }) => {
  return (
    <div className={`message-box player-${className}`} style={style}>
      <Avatar image={image}></Avatar>
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
