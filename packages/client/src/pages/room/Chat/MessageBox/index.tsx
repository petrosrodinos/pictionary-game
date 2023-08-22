import { FC } from "react";
import "./style.scss";
import Typography from "../../../../components/ui/Typography";
import Avatar from "../../../../components/ui/Avatar";
import { authStore } from "../../../../store/authStore";

interface MessageBoxProps {
  value?: string;
  style?: React.CSSProperties;
  className?: string;
}

const MessageBox: FC<MessageBoxProps> = ({ value, style, className = "" }) => {
  const currHour = new Date().getHours();
  const currMin = new Date().getMinutes();
  value = "Hello World Hello WorldHello WorldHello WorldHello World";
  const time = `${currHour}:${currMin}`;
  const { username, level, avatar, xp } = authStore((state) => state);

  return (
    <div className={`message-box-container ${className}`} style={style}>
      <div className="message-box-left">
        <Avatar className="message-box-avatar" image={avatar}></Avatar>
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
