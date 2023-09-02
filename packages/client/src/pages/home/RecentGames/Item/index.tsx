import { FC } from "react";
import Typography from "../../../../components/ui/Typography";
import { Game } from "../../../../interfaces/typing";
import { formatDate } from "../../../../utils/date";
import { useTranslation } from "react-i18next";
import "./style.scss";

interface RecentGamesItemProps {
  item: Game;
}

const RecentGamesItem: FC<RecentGamesItemProps> = ({ item }) => {
  const { t } = useTranslation();
  return (
    <div className="recent-games-item">
      <span className="recent-rank-container">
        <Typography>{item.rank}</Typography>
      </span>

      <div className="recent-game-info-container">
        <span>
          <Typography className="recent-game-item-label">{t("xp-earned")}:</Typography>
          <Typography>{item.points}</Typography>
        </span>
        <span>
          <Typography className="recent-game-item-label">{t("played-at")}:</Typography>
          <Typography>{formatDate(item.date)}</Typography>
        </span>
      </div>
    </div>
  );
};

export default RecentGamesItem;
