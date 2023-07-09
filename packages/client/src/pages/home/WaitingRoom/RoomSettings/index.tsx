import { FC } from "react";
import Typography from "../../../../components/ui/Typography";
import "./style.scss";

interface RoomSettingsProps {
  settings: {
    players: number;
    rounds: number;
  };
}

const RoomSettings: FC<RoomSettingsProps> = ({ settings }) => {
  return (
    <div className="settings-container">
      <Typography variant="sub-header-main">Settings</Typography>
      <div className="settings-content">
        <Typography>PLAYERS:{settings.players}</Typography>
        <Typography>ROUNDS:{settings.rounds}</Typography>
      </div>
    </div>
  );
};

export default RoomSettings;
