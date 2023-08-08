import { FC } from "react";
import "./style.scss";
import MessageBox from "./MessageBox";

interface ChatProps {}

const Chat: FC<ChatProps> = () => {
  return (
    <div className="chat-container">
      <MessageBox></MessageBox>
    </div>
  );
};

export default Chat;
