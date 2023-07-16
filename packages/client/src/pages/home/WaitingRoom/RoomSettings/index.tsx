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
      <Typography className="settings-label" variant="header-main">
        Settings
      </Typography>
      <div className="settings-content">
        <Typography>
          PLAYERS:<Typography>{settings.players}</Typography>
        </Typography>
        <Typography>
          ROUNDS:<Typography>{settings.rounds}</Typography>
        </Typography>
      </div>
    </div>
  );
};

export default RoomSettings;
