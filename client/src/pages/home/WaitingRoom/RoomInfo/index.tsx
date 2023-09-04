import { FC, useMemo } from "react";
import Typography from "../../../../components/ui/Typography";
import { CLIENT_URL } from "../../../../constants";
import { RoomInfo as RoomInfoInt } from "../../../../interfaces/typing";
import Copable from "../../../../components/ui/Copable";
import { useTranslation } from "react-i18next";
import "./style.scss";

interface RoomInfoProps {
  roomInfo: RoomInfoInt;
}

const RoomInfo: FC<RoomInfoProps> = ({ roomInfo }) => {
  const { t } = useTranslation();
  const creatorUsername = useMemo(() => {
    return roomInfo.players.find((user: any) => user.userId === roomInfo.creator)?.username;
  }, [roomInfo]);

  return (
    <div className="room-info-container">
      <Typography className="room-stat">
        <Typography variant="text-accent" className="waiting-room-label">
          {t("code")}:
        </Typography>{" "}
        <Copable value={roomInfo.code}>{roomInfo.code}</Copable>
      </Typography>
      <Typography className="room-stat">
        <Typography variant="text-accent" className="waiting-room-label">
          {t("link")}:
        </Typography>{" "}
        <Typography className="room-stat">
          <Copable value={`${CLIENT_URL}home?room=${roomInfo.code}`}>
            {CLIENT_URL}home?room={roomInfo.code}
          </Copable>
        </Typography>
      </Typography>
      <Typography className="room-stat">
        <Typography variant="text-accent" className="waiting-room-label">
          {t("creator")}:
        </Typography>
        @{creatorUsername}
      </Typography>
    </div>
  );
};

export default RoomInfo;
