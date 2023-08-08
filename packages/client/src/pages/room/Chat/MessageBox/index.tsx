import { FC } from "react";
import "./style.scss";
import Typography from "../../../../components/ui/Typography";
import Avatar from "../../../../components/ui/Avatar";

interface MessageBoxProps {
  value?: string;
  style?: React.CSSProperties;
  className?: string;
}

const MessageBox: FC<MessageBoxProps> = ({ value, style, className = "" }) => {
  return (
    <div className={`chat-container ${className}`} style={style}>
      <div>
        {" "}
        <Avatar></Avatar>
      </div>
      <div>
        <Typography variant="small-text-accent"> cu papi munianio </Typography>
      </div>
    </div>
  );
};

export default MessageBox;
