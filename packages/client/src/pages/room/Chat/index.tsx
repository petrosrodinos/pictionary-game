import { FC, useEffect, useState } from "react";
import "./style.scss";
import MessageBox from "./MessageBox";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { BiSend } from "react-icons/bi";
import { RoomInfo } from "../../../interfaces/typing";
import { authStore } from "../../../store/authStore";

interface ChatProps {
  socket: any;
}

const Chat: FC<ChatProps> = ({ socket }) => {
  const [formValue, setFormValue] = useState("");
  const { username, avatar } = authStore((state) => state);
  const [roomInfo, setRoomInfo] = useState<RoomInfo>();

  //edw stelno oti exei to input ta stoixeia toy xristi kai thn ora
  function send_data(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    socket?.emit("game-input-message", {
      message: formValue,
      username,
      avatar,
      time: get_time(),
    });
  }

  // TI KANEI O CLIENT OTAN LAMBANEI MYNHMA APO TON SERVER
  useEffect(() => {
    socket?.on("chat-message", (roomInfo: RoomInfo) => {
      setRoomInfo(roomInfo);
      console.log("chat-message", roomInfo.chat);
    });
    return () => {
      socket?.off("chat-message");
    };
  }, [socket]);

  //function gia na pairnoy thn wra
  function get_time() {
    const currHour = new Date().getHours();
    const currMin = new Date().getMinutes();
    const time = `${currHour}:${currMin}`;
    return time;
  }

  return (
    <div className="chat-container">
      {roomInfo?.chat.map((msg, index) => (
        <MessageBox
          key={index}
          value={msg.message}
          username={msg.username}
          time={msg.time}
          image={msg.avatar}
          className=""
        />
      ))}
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
  );
};

export default Chat;
