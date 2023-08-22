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
  //const message = "kano diaroia ";
  function send_data() {
    console.log("Chat");
    //  socket?.emit("game-input-message", message);
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
      <form className="chat-send-container" onSubmit={send_data}>
        <Input
          //     error={errors.username?.message}
          name="send a message"
          placeholder="send a message"
        />
        <Button type="submit" icon={BiSend} title="Send" variant="primary" />
      </form>
    </div>
  );
};

export default Chat;
