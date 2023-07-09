import { FC } from "react";
import Avatar from "../../../../components/ui/Avatar";
import Typography from "../../../../components/ui/Typography";
import "./style.scss";

interface LeaderBoardItemProps {
  item: LeaderBoardItem;
}

const LeaderBoardItem: FC<LeaderBoardItemProps> = ({ item }) => {
  return (
    <div className="leader-board-item">
      <span className="rank-container">
        <Typography>{item.rank}</Typography>
      </span>
      <Avatar image={item.avatar} />
      <div className="user-info-container">
        <Typography>@{item.username}</Typography>
        <span>
          <Typography>xp:</Typography>
          <Typography>{item.xp}</Typography>
        </span>
        <span>
          <Typography>games: </Typography>
          <Typography>{item.games}</Typography>
        </span>
      </div>
    </div>
  );
};

export default LeaderBoardItem;
