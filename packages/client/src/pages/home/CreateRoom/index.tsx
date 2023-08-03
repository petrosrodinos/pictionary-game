import { FC, useState } from "react";
import Typography from "../../../components/ui/Typography";
import Button from "../../../components/ui/Button";
import { CLIENT_URL } from "../../../constants";
import GameSettings from "./GameSettings";
import { CHOOSING_WORD_TIME, MAX_PLAYERS, ROUND_TIME } from "../../../constants/game";
import { createRoomCode } from "../../../utils/code";
import "./style.scss";

interface CreateRoomProps {
  onCancel: () => void;
  onCreate: (name: GameSettings) => void;
}

const CreateRoom: FC<CreateRoomProps> = ({ onCancel, onCreate }) => {
  const [settings, setSettings] = useState<GameSettings>({
    maxPlayers: MAX_PLAYERS,
    category: "",
    roundTime: ROUND_TIME,
    choosingWordTime: CHOOSING_WORD_TIME,
    code: createRoomCode(),
  });

  const handleSettingsChanged = ({ name, value }: { name: string; value: string | number }) => {
    setSettings({
      ...settings,
      [name]: value,
    });
  };

  const handleCreateRoom = () => {
    if (
      !settings.category ||
      !settings.choosingWordTime ||
      !settings.roundTime ||
      !settings.maxPlayers
    )
      return alert("Please fill out all the fields");
    onCreate(settings);
  };

  return (
    <div className="create-room-container">
      <Typography variant="text-accent" className="text-primary-label">
        To play with friends,send them the code
      </Typography>
      <Typography className="text-secondary-label">#{settings.code}</Typography>
      <Typography variant="text-accent" className="text-primary-label">
        Or the link
      </Typography>
      <Typography className="text-secondary-label game-link">
        {CLIENT_URL}home?waitingRoom={settings.code}
      </Typography>
      <GameSettings settings={settings} onChange={handleSettingsChanged} />
      <div className="buttons-container">
        <Button onClick={handleCreateRoom} title="Create" />
        <Button onClick={onCancel} variant="secondary" title="Cancel" />
      </div>
    </div>
  );
};

export default CreateRoom;
