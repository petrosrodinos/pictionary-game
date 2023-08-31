import { FC, useMemo } from "react";
import Typography from "../../../../components/ui/Typography";
import { CLIENT_URL } from "../../../../constants";
import { RoomInfo as RoomInfoInt } from "../../../../interfaces/typing";
import "./style.scss";
import Copable from "../../../../components/ui/Copable";

interface RoomInfoProps {
  roomInfo: RoomInfoInt;
}

const RoomInfo: FC<RoomInfoProps> = ({ roomInfo }) => {
  const creatorUsername = useMemo(() => {
    return roomInfo.players.find((user: any) => user.userId === roomInfo.creator)?.username;
  }, [roomInfo]);

  return (
    <div className="room-info-container">
      <Typography className="room-stat">
        <Typography variant="text-accent" className="waiting-room-label">
          Code:
        </Typography>{" "}
        <Copable value={roomInfo.code}>{roomInfo.code}</Copable>
      </Typography>
      <Typography className="room-stat">
        <Typography variant="text-accent" className="waiting-room-label">
          Link:
        </Typography>{" "}
        <Typography className="room-stat">
          <Copable value={`${CLIENT_URL}home?room=${roomInfo.code}`}>
            {CLIENT_URL}home?room={roomInfo.code}
          </Copable>
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
