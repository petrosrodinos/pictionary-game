import { FC } from "react";
import Avatar from "../../../../components/ui/Avatar";
import Typography from "../../../../components/ui/Typography";
import { UserType } from "../../../../interfaces/typing";
import { POINTS_PER_LEVEL } from "../../../../constants/game";
import { useTranslation } from "react-i18next";
import "./style.scss";

interface LeaderBoardItemProps {
  item: UserType;
}

const LeaderBoardItem: FC<LeaderBoardItemProps> = ({ item }) => {
  const { t } = useTranslation();
  const totalPoints = item.level == 1 ? item.xp : item.level * POINTS_PER_LEVEL + item.xp;
  return (
    <div className="leader-board-item">
      <span className="rank-container">
        <Typography>{item.level}</Typography>
      </span>
      <Avatar image={item.avatar} />
      <div className="user-info-container">
        <Typography variant="text-main" className="info-username-label">
          @{item.username}
        </Typography>
        <span>
          <Typography>{t("xp")}:</Typography>
          <Typography>{totalPoints == POINTS_PER_LEVEL ? 0 : totalPoints}</Typography>
        </span>
        <span>
          <Typography>{t("games")}: </Typography>
          <Typography>{item?.games?.length}</Typography>
        </span>
      </div>
    </div>
  );
};

export default LeaderBoardItem;
