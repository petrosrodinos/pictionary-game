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
  currentUserIsPlaying: boolean;
}

const Chat: FC<ChatProps> = ({ socket, currentUserIsPlaying }) => {
  const [formValue, setFormValue] = useState("");
  const { username, avatar } = authStore((state) => state);
  const [roomInfo, setRoomInfo] = useState<RoomInfo>();

  //edw stelno oti exei to input ta stoixeia toy xristi kai thn ora
  function sendData(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    socket?.emit("game-input-message", {
      message: formValue,
      username,
      avatar,
      time: getTime(),
    });
  }
  let i = 0;
  // TI KANEI O CLIENT OTAN LAMBANEI MYNHMA APO TON SERVER
  useEffect(() => {
    socket?.on("chat-message", (roomInfo: RoomInfo) => {
      setRoomInfo(roomInfo);
      console.log("chat-message", roomInfo.chat[i]);
      i++;

      roomInfo.chat[i].person = "me";
      console.log("chat-message", roomInfo.chat[i - 1]);
    });
    return () => {
      socket?.off("chat-message");
    };
  }, [socket]);

  //function gia na pairnoy thn wra
  function getTime() {
    const currHour = new Date().getHours();
    //const currHour = 2;
    let hour = currHour.toString();
    if (hour.length < 2) {
      hour.toString();
      hour = "0" + hour;
    }
    const currMin = new Date().getMinutes();
    let min = currMin.toString();
    if (min.length < 2) {
      min.toString();
      min = "0" + min;
    }
    const time = `${hour}:${min}`;
    console.log(time);
    return time;
  }

  function playerCheck(message_name: string, my_name: string) {
    if (message_name === my_name) {
      return "me";
    } else {
      return "another";
    }
  }
  function playerCheckName(message_name: string, my_name: string) {
    if (message_name === my_name) {
      return "Me";
    } else {
      return message_name;
    }
  }
  return (
    <div className="chat">
      <div className="chat-container">
        {roomInfo?.chat.map((msg, index) => (
          <MessageBox
            key={index}
            value={msg.message}
            username={playerCheckName(msg.username, username)}
            // username={msg.username}
            time={msg.time}
            image={msg.avatar}
            className={playerCheck(msg.username, username)}
            //className="me"
          />
        ))}
      </div>
      {currentUserIsPlaying && (
        <>
          <form className="message-form" onSubmit={sendData}>
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
        </>
      )}
    </div>
  );
};

export default Chat;
