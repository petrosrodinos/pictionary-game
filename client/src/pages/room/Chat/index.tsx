import { FC, useEffect, useState } from "react";
import MessageBox from "./MessageBox";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { BiSend } from "react-icons/bi";
import { Message, RoomInfo } from "../../../interfaces/typing";
import { authStore } from "../../../store/authStore";
import { useTranslation } from "react-i18next";
import "./style.scss";

interface ChatProps {
  socket: any;
  currentUserIsPlaying: boolean;
  chat: Message[];
}

const Chat: FC<ChatProps> = ({ socket, chat, currentUserIsPlaying }) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const { username, avatar, userId } = authStore((state) => state);
  const [messages, setMessages] = useState<Message[]>();

  const sendData = () => {
    if (!message || message.length > 20) return;
    socket?.emit("game-input-message", {
      message,
      username,
      avatar,
      userId,
    });
    setMessage("");
  };

  useEffect(() => {
    socket?.on("chat-message", (roomInfo: RoomInfo) => {
      setMessages(roomInfo.chat);
    });
    return () => {
      socket?.off("chat-message");
    };
  }, [socket]);

  useEffect(() => {
    setMessages(chat);
  }, [chat]);

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
      <div
        style={{ maxHeight: `${currentUserIsPlaying ? "600px" : "500px"}` }}
        className="messages-container"
      >
        {messages?.map((msg, index) => (
          <MessageBox
            key={index}
            curruntUserIsPlaying={currentUserIsPlaying}
            message={msg}
            className={playerCheck(msg.username, username)}
          />
        ))}
      </div>
      {!currentUserIsPlaying && (
        <div className="message-form">
          <Input
            name="answer"
            placeholder={t("answer")}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button onClick={sendData} title={t("send")} variant="primary" icon={BiSend} />
        </div>
      )}
    </div>
  );
};

export default Chat;
