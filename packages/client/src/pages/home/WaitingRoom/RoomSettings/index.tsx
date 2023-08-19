import { FC } from "react";
import Typography from "../../../../components/ui/Typography";
import { RoomInfo } from "../../../../interfaces/typing";
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
            CATEGORY:
          </Typography>
          <Typography variant="text-main" className="room-stat">
            {roomInfo.category}
          </Typography>
        </Typography>
        <Typography>
          <Typography variant="text-accent" className="waiting-room-label">
            DIFFICALTY:
          </Typography>
          <Typography variant="text-main" className="room-stat">
            {roomInfo.difficalty}
          </Typography>
        </Typography>
        <Typography>
          <Typography variant="text-accent" className="waiting-room-label">
            MAX PLAYERS:
          </Typography>
          <Typography variant="text-main" className="room-stat">
            {roomInfo.maxPlayers}
          </Typography>
        </Typography>
        <Typography>
          <Typography variant="text-accent" className="waiting-room-label">
            ROUND TIME:
          </Typography>
          <Typography variant="text-main" className="room-stat">
            {roomInfo.roundTime / 1000}
          </Typography>
          <Typography variant="text-accent" className="waiting-room-label">
            {" "}
            (s)
          </Typography>
        </Typography>
        <Typography>
          <Typography variant="text-accent" className="waiting-room-label">
            CHOOSING WORD TIME:
          </Typography>
          <Typography variant="text-main" className="room-stat">
            {roomInfo.choosingWordTime / 1000}
          </Typography>
          <Typography variant="text-accent" className="waiting-room-label">
            {" "}
            (s)
          </Typography>
        </Typography>
      </div>
    </div>
  );
};

export default RoomSettings;
