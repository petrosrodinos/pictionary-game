import { FC } from "react";
import Button from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import "./style.scss";

interface MessageProps {
  message?: string;
}

const Message: FC<MessageProps> = () => {
  const navigate = useNavigate();
  return (
    <div className="message-container">
      <Button title="GO BACK TO HOME PAGE" onClick={() => navigate("/home")} />
    </div>
  );
};

export default Message;
