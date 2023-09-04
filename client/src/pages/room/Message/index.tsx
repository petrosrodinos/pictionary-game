import { FC } from "react";
import Button from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./style.scss";

interface MessageProps {
  message?: string;
}

const Message: FC<MessageProps> = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="message-container">
      <Button title={t("go-back-to-home-page")} onClick={() => navigate("/home")} />
    </div>
  );
};

export default Message;
