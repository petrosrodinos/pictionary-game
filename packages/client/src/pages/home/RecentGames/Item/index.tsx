import { FC } from "react";
import Avatar from "../../../../components/ui/Avatar";
import Typography from "../../../../components/ui/Typography";
import "./style.scss";

interface RecentGamesItemProps {
  item: UserType;
}

const RecentGamesItem: FC<RecentGamesItemProps> = ({ item }) => {
  return (
    <div className="recent-leader-board-item">
      <span className="recent-rank-container">
        <Typography>{item.rank}</Typography>
      </span>
      <Avatar image={item.avatar} />
      <div className="recent-user-info-container">
        <Typography variant="text-main" className="recent-info-username-label">
          @{item.username}
        </Typography>
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

export default RecentGamesItem;
