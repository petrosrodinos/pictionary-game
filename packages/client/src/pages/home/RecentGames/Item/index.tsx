import { FC } from "react";
import Typography from "../../../../components/ui/Typography";
import { Game } from "../../../../interfaces/typing";
import { formatDate } from "../../../../utils/date";
import "./style.scss";

interface RecentGamesItemProps {
  item: Game;
}

const RecentGamesItem: FC<RecentGamesItemProps> = ({ item }) => {
  return (
    <div className="recent-games-item">
      <span className="recent-rank-container">
        <Typography>{item.rank}</Typography>
      </span>

      <div className="recent-game-info-container">
        <span>
          <Typography>XP earned:</Typography>
          <Typography>{item.points}</Typography>
        </span>
        <span>
          <Typography>Played At:</Typography>
          <Typography>{formatDate(item.date)}</Typography>
        </span>
      </div>
    </div>
  );
};

export default RecentGamesItem;
