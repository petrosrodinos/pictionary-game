import { FC } from "react";
import Typography from "../../../components/ui/Typography";
import LeaderBoardItem from "./Item";
import { AvatarGenerator } from "random-avatar-generator";
import "./style.scss";

const generator = new AvatarGenerator();

const leaderBoardItems: LeaderBoardItem[] = [...new Array(10)].map((_, index) => {
  return {
    id: index,
    rank: index,
    avatar: generator.generateRandomAvatar(),
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
        {leaderBoardItems.map((item: any, index: number) => {
          return <LeaderBoardItem key={index} item={item} />;
        })}
      </div>
    </div>
  );
};

export default LeaderBoard;
