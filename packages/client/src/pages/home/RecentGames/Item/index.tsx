import { FC } from "react";
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
     
      <div className="recent-user-info-container">

        <span>
          <Typography>xp:</Typography>
          <Typography>{item.xp}</Typography>
        </span>
        <span>
        <Typography>Date:</Typography>
        <Typography>{item.date}</Typography>
          
          {/* <Typography>Date: {currDay}/{currMonth}/{currYear} </Typography> */}
          {/* <Typography>{item.games}</Typography> */}
        </span>
      </div>
    </div>
  );
};

export default RecentGamesItem;
