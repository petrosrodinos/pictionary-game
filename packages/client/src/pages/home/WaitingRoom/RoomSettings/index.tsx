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
          <Typography variant="text-accent" className="waiting-room-label">
            PLAYERS:
          </Typography>
          <Typography variant="text-main" className="room-stat">
            {settings.players}
          </Typography>
        </Typography>
        <Typography>
          <Typography variant="text-accent" className="waiting-room-label">
            ROUNDS:
          </Typography>
          <Typography variant="text-main" className="room-stat">
            {settings.rounds}
          </Typography>
        </Typography>
      </div>
    </div>
  );
};

export default RoomSettings;
