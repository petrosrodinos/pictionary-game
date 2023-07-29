import { FC, useState, useMemo } from "react";
import Typography from "../../../components/ui/Typography";
import Button from "../../../components/ui/Button";
import { CLIENT_URL } from "../../../constants";
import GameSettings from "./GameSettings";
import { MAX_PLAYERS } from "../../../constants/game";
import "./style.scss";

interface CreateRoomProps {
  onCancel: () => void;
  onCreate: (name: GameSettings) => void;
}

const CreateRoom: FC<CreateRoomProps> = ({ onCancel, onCreate }) => {
  const getCode = useMemo(() => {
    return Math.random().toString(36).substring(2, 7).toUpperCase();
  }, []);

  const [settings, setSettings] = useState<GameSettings>({
    players: MAX_PLAYERS,
    code: getCode,
  });

  const handleSettingsChanged = ({ name, value }: { name: string; value: number }) => {
    setSettings({
      ...settings,
      [name]: value,
    });
  };

  return (
    <div className="create-room-container">
      <Typography variant="text-accent" className="text-primary-label">
        To play with friends,send them the code
      </Typography>
      <Typography className="text-secondary-label">#{getCode}</Typography>
      <Typography variant="text-accent" className="text-primary-label">
        Or the link
      </Typography>
      <Typography className="text-secondary-label game-link">
        {CLIENT_URL}room/{getCode}
      </Typography>
      <GameSettings onChange={handleSettingsChanged} />
      <div className="buttons-container">
        <Button onClick={() => onCreate(settings)} title="Create" />
        <Button onClick={onCancel} variant="secondary" title="Cancel" />
      </div>
    </div>
  );
};

export default CreateRoom;
