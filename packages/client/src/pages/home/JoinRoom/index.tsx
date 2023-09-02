import { FC, useState } from "react";
import Typography from "../../../components/ui/Typography";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import { useTranslation } from "react-i18next";
import "./style.scss";

interface JoinRoomProps {
  onJoinRoom: (code: string) => void;
}

const JoinRoom: FC<JoinRoomProps> = ({ onJoinRoom }) => {
  const { t } = useTranslation();
  const [code, setCode] = useState<string>("");
  return (
    <div className="join-room-container">
      <div className="join-room-content">
        <Typography variant="text-accent">{t("enter-code")}</Typography>
        <Input placeholder={t("code")} value={code} onChange={(e) => setCode(e.target.value)} />
        <Button title={t("join")} onClick={() => onJoinRoom(code)} />
      </div>
    </div>
  );
};

export default JoinRoom;
