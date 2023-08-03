import { FC, useMemo } from "react";
import Typography from "../../../../components/ui/Typography";
import { CLIENT_URL } from "../../../../constants";
import "./style.scss";

interface RoomInfoProps {
  roomInfo: RoomInfo;
}

const RoomInfo: FC<RoomInfoProps> = ({ roomInfo }) => {
  const creatorUsername = useMemo(() => {
    return roomInfo.players.find((user: any) => user.userId === roomInfo.creator)?.username;
  }, [roomInfo.creator]);

  return (
    <div className="room-info-container">
      <Typography className="room-stat">
        <Typography variant="text-accent" className="waiting-room-label">
          Code:
        </Typography>{" "}
        {roomInfo.code}
      </Typography>
      <Typography className="room-stat">
        <Typography variant="text-accent" className="waiting-room-label">
          Link:
        </Typography>{" "}
        <Typography className="room-stat waiting-room-link">
          {CLIENT_URL}home?waitingRoom=
          {roomInfo.code}
        </Typography>
      </Typography>
      <Typography className="room-stat">
        <Typography variant="text-accent" className="waiting-room-label">
          Creator:
        </Typography>
        @{creatorUsername}
      </Typography>
    </div>
  );
};

export default RoomInfo;
