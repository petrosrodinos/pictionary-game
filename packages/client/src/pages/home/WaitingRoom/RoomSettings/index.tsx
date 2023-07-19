import { FC } from "react";
import Typography from "../../../../components/ui/Typography";
import "./style.scss";

interface RoomSettingsProps {
  roomInfo: RoomInfo;
}

const RoomSettings: FC<RoomSettingsProps> = ({ roomInfo }) => {
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
            {roomInfo.players}
          </Typography>
        </Typography>
        <Typography>
          <Typography variant="text-accent" className="waiting-room-label">
            ROUNDS:
          </Typography>
          <Typography variant="text-main" className="room-stat">
            {roomInfo.rounds}
          </Typography>
        </Typography>
      </div>
    </div>
  );
};

export default RoomSettings;
