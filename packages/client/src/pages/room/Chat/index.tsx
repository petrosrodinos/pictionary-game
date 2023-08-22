import { FC, useEffect } from "react";
import "./style.scss";
import MessageBox from "./MessageBox";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { BiSend } from "react-icons/bi";
import { RoomInfo } from "../../../interfaces/typing";

interface ChatProps {
  socket: any;
}

const Chat: FC<ChatProps> = ({ socket }) => {
  const message = "kano diaroia ";
  function send_data() {
    console.log("Chat");
    socket?.emit("game-input-message", message);
    //socket?.emit("game-input-message", "hello world");
  }
  useEffect(() => {
    socket?.on("chat-message", (roomInfo: RoomInfo) => {
      console.log("message", roomInfo.chat);
    });
  }, [socket]);
  return (
    <div className="chat-container">
      <MessageBox />
      <div className="chat-input">
        <Input name="Answer" placeholder="Answer" />
        <div className="chat-input-gap"></div>
        <Button
          type="submit"
          title="Send"
          variant="primary"
          icon={BiSend}
          className="answer-button"
          onClick={send_data}
        />
      </div>
    </div>
  );
};

export default Chat;
