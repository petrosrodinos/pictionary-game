import { FC, useEffect } from "react";
import Typography from "../../../../components/ui/Typography";
import Avatar from "../../../../components/ui/Avatar";
import { useSound } from "../../../../hooks/sound";
import { authStore } from "../../../../store/authStore";
import { Message } from "../../../../interfaces/typing";
import "./style.scss";

interface MessageBoxProps {
  className: string;
  message: Message;
}

const MessageBox: FC<MessageBoxProps> = ({ message, className }) => {
  const { avatar, username, message: msg, correct } = message;
  const { username: myUsername } = authStore((state) => state);
  const { play } = useSound();

  useEffect(() => {
    if (correct && username === myUsername) {
      play("word-found-you");
    } else if (correct && username !== myUsername) {
      play("word-found-others");
    }
  }, []);

  function playerCheckName() {
    if (username === myUsername) {
      return "You";
    } else {
      return username;
    }
  }

  return (
    <div className={`message-box player-${className}`}>
      <Avatar image={avatar}></Avatar>
      <div className="message-box-text-container">
        <Typography variant="small-text-main " className="message-box-username">
          {playerCheckName()}
        </Typography>
        <Typography variant="small-text-accent" className="message-box-text">
          {!correct ? msg : "Guessed the word!"}
        </Typography>
      </div>
    </div>
  );
};

export default MessageBox;
