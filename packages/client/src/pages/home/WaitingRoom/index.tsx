import { FC, useState, useEffect } from "react";
import Typography from "../../../components/ui/Typography";
import UsersGrid from "../../../components/UsersGrid";
import { getRandomAvatar } from "../../../utils/avatar";
import Button from "../../../components/ui/Button";
import { useSearchParams } from "react-router-dom";
import RoomSettings from "./RoomSettings";
import RoomInfo from "./RoomInfo";
import "./style.scss";

interface WaitingRoomProps {
  onLeave: () => void;
}

const TestUsers: UserType[] = [...new Array(5)].map((_, index) => ({
  id: index,
  username: `username${index + 1}`,
  avatar: getRandomAvatar(),
  rank: index + 1,
  level: index + 1,
}));

const WaitingRoom: FC<WaitingRoomProps> = ({ onLeave }) => {
  const [roomInfo, setRoomInfo] = useState<RoomInfo>();
  const [searchParams, _] = useSearchParams();

  //useEffect detects for searchParams and getting the rooms info
  useEffect(() => {
    const waitingRoomCode = searchParams.get("waitingRoom");
    if (waitingRoomCode) {
      //1)checks if game exists
      //2)checks if game is started
      //if(gameStarted){
      //ton pame sto game
      //}
      setRoomInfo({
        creator: TestUsers[0].username,
        code: waitingRoomCode,
        users: TestUsers,
        settings: {
          players: 5,
          rounds: 5,
        },
      });
    }
  }, [searchParams]);

  return (
    <div className="waiting-room-container">
      {roomInfo ? (
        <>
          <RoomInfo roomInfo={roomInfo} />
          <UsersGrid users={roomInfo.users} />
          <RoomSettings settings={roomInfo.settings} />
        </>
      ) : (
        <Typography>Room does not exist :(</Typography>
      )}
      <Button title="START" onClick={onLeave} />
    </div>
  );
};

export default WaitingRoom;
