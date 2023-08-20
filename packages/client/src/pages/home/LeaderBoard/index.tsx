import { FC } from "react";
import Typography from "../../../components/ui/Typography";
import LeaderBoardItem from "./Item";
import { useQuery } from "react-query";
import { UserType } from "../../../interfaces/typing";
import { getUsers } from "../../../services/user";
import Spinner from "../../../components/ui/Spinner";
import "./style.scss";

const LeaderBoard: FC = () => {
  const { isLoading, data } = useQuery("get-users", () => {
    return getUsers();
  });

  return (
    <div className="leader-board-container">
      <Typography variant="sub-header-main">LEADER BOARD</Typography>
      <div className="leader-board-content-container">
        <Spinner loading={isLoading} />
        <div className="leader-board-content">
          {!data && !isLoading && (
            <Typography className="no-leader-board-games-label" variant="sub-header-main">
              No games exist yet
            </Typography>
          )}
          {data?.map((item: UserType, index: number) => {
            return <LeaderBoardItem key={index} item={item} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;
