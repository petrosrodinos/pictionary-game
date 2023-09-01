import { FC, useEffect, useState } from "react";
import MessageBox from "./MessageBox";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { BiSend } from "react-icons/bi";
import { Message, RoomInfo } from "../../../interfaces/typing";
import { authStore } from "../../../store/authStore";
import "./style.scss";

interface ChatProps {
  socket: any;
  currentUserIsPlaying: boolean;
}

const Chat: FC<ChatProps> = ({ socket, currentUserIsPlaying }) => {
  const [message, setMessage] = useState("");
  const { username, avatar, userId } = authStore((state) => state);
  const [messages, setMessages] = useState<Message[]>();

  function sendData() {
    socket?.emit("game-input-message", {
      message: message,
      username,
      avatar,
      userId,
    });
    setMessage("");
  }

  useEffect(() => {
    socket?.on("chat-message", (roomInfo: RoomInfo) => {
      setMessages(roomInfo.chat);
    });
    return () => {
      socket?.off("chat-message");
    };
  }, [socket]);

  function playerCheck(message_name: string, my_name: string) {
    if (message_name === my_name) {
      return "me";
    } else {
      return "another";
    }
  }

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      sendData();
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages?.map((msg, index) => (
          <MessageBox key={index} message={msg} className={playerCheck(msg.username, username)} />
        ))}
      </div>
      {!currentUserIsPlaying && (
        <div className="message-form">
          <Input
            name="Answer"
            placeholder="Answer"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            onClick={sendData}
            type="submit"
            title="Send"
            variant="primary"
            icon={BiSend}
            className="answer-button"
          />
        </div>
      )}
    </div>
  );
};

export default Chat;
