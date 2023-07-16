import { FC, useState } from "react";
import Typography from "../../../components/ui/Typography";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import "./style.scss";

interface JoinRoomProps {
  onJoinRoom: (code: string) => void;
}

const JoinRoom: FC<JoinRoomProps> = ({ onJoinRoom }) => {
  const [code, setCode] = useState<string>("");
  return (
    <div className="join-room-container">
      <div className="join-room-content">
        <Typography variant="text-accent">Enter the code your friends sent you</Typography>
        <Input placeholder="Code" value={code} onChange={(e) => setCode(e.target.value)} />
        <Button title="JOIN" onClick={() => onJoinRoom(code)} />
      </div>
    </div>
  );
};

export default JoinRoom;
