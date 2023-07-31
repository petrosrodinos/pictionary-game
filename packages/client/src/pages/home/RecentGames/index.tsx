import { FC } from "react";
import Typography from "../../../components/ui/Typography";
import RecentGamesItem from "./Item";
import { getRandomAvatar } from "../../../utils/avatar";
import "./style.scss";


const currMonth = new Date().getMonth();
const currYear = new Date().getFullYear();
const currDay = new Date().getDate();
const currHour = new Date().getHours();
const currMin = new Date().getMinutes();


const TestRecentGamesItems: UserType[] = [...new Array(20)].map((_, index) => {
  return {
    userId: index,
    rank: 1 + index,
    avatar: getRandomAvatar(),
    username: `username${index}`,
    xp: 50- index * 2,
    games: 30 - index,
    date: ` ${currDay-index}/${currMonth}/${currYear}, ${currHour}:${currMin-index}`,
  };
});


const RecentGames: FC = () => {
  return (
    <div className="recent-leader-board-container">
      <div className="recent-games-label">
      <Typography variant="sub-header-main">Recent Games</Typography>
      </div>
      <div className="recent-leader-board-content">
        {TestRecentGamesItems.map((item: any, index: number) => {
          return <RecentGamesItem key={index} item={item} />;
        })}
      </div>
    </div>
  );
};

export default RecentGames;
