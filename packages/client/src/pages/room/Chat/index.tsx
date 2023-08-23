import { FC, useEffect, useState } from "react";
import "./style.scss";
import MessageBox from "./MessageBox";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { BiSend } from "react-icons/bi";
import { RoomInfo } from "../../../interfaces/typing";
//import RoomInfo from "../../home/WaitingRoom/RoomInfo";
import { authStore } from "../../../store/authStore";

interface ChatProps {
  socket: any;
}

const Chat: FC<ChatProps> = ({ socket }) => {
  const [formValue, setFormValue] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const { username, avatar } = authStore((state) => state);

  //edw stelno oti exei to input
  function send_data(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    socket?.emit("game-input-message", formValue);
  }
  //edw kano broadcast to messages poy exw labei
  useEffect(() => {
    socket?.on("chat-message", (roomInfo: RoomInfo) => {
      setMessages(roomInfo.chat);
      console.log("chat-message", {
        username,
        avatar,
        messages: formValue,
      });
    });
    return () => {
      socket?.off("chat-message");
    };
  }, [socket]);

  return (
    <div className="chat-container">
      {messages.map((msg, index) => (
        <MessageBox key={index} value={msg} />
      ))}
      <div className="chat-input">
        <form className="message-form" onSubmit={send_data}>
          <Input
            name="Answer"
            placeholder="Answer"
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
          />
          <div className="chat-input-gap"></div>
          <Button
            type="submit"
            title="Send"
            variant="primary"
            icon={BiSend}
            className="answer-button"
          />
        </form>
      </div>
    </div>
  );
};

export default Chat;
