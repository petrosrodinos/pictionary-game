import { FC } from "react";
import Typography from "../../../components/ui/Typography";
import UsersGrid from "../../../components/UsersGrid";
import { getRandomAvatar } from "../../../utils/avatar";
import Button from "../../../components/ui/Button";
import "./style.scss";

interface WaitingRoomProps {
  onLeave: () => void;
}

const Users: UserType[] = [...new Array(5)].map((_, index) => ({
  id: index,
  username: `username${index}`,
  avatar: getRandomAvatar(),
  rank: index,
  level: index,
}));

const WaitingRoom: FC<WaitingRoomProps> = ({ onLeave }) => {
  return (
    <div className="waiting-room-container">
      <Typography variant="sub-header-main" className="room-stat title">
        WAITING ROOM
      </Typography>
      <Typography variant="text-accent" className="room-stat">
        code #1452
      </Typography>
      <Typography variant="text-accent" className="room-stat">
        Creator:@username1
      </Typography>
      <UsersGrid users={Users} />
      <Button title="LEAVE" onClick={onLeave} />
    </div>
  );
};

export default WaitingRoom;
