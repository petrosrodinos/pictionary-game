import { FC } from "react";
import Typography from "../../../components/ui/Typography";
import LeaderBoardItem from "./Item";
import { getRandomAvatar } from "../../../utils/avatar";
import "./style.scss";

const TestLeaderBoardItems: UserType[] = [...new Array(10)].map((_, index) => {
  return {
    id: index,
    rank: 10 - index,
    avatar: getRandomAvatar(),
    username: `username${index}`,
    xp: 3500,
    games: 30,
  };
});

const LeaderBoard: FC = () => {
  return (
    <div className="leader-board-container">
      <Typography variant="sub-header-main">LEADER BOARD</Typography>
      <div className="leader-board-content">
        {TestLeaderBoardItems.map((item: any, index: number) => {
          return <LeaderBoardItem key={index} item={item} />;
        })}
      </div>
    </div>
  );
};

export default LeaderBoard;
