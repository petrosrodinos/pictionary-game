import { FC } from "react";
import Typography from "../../../components/ui/Typography";
import LeaderBoardItem from "./Item";
import { useQuery } from "react-query";
import { UserType } from "../../../interfaces/typing";
import { getUsers } from "../../../services/user";
import Spinner from "../../../components/ui/Spinner";
import "./style.scss";

const LeaderBoard: FC = () => {
  const { isLoading, data, error } = useQuery("get-users", () => {
    return getUsers();
  });

  return (
    <div className="leader-board-container">
      <Typography variant="sub-header-main">LEADER BOARD</Typography>
      <div className="leader-board-content-container">
        <div className="leader-board-content">
          {(!data || data.length == 0) && (
            <div className="no-games-exist">
              <Spinner style={{ alignSelf: "center" }} loading={isLoading} />
              {!isLoading && (
                <Typography variant="sub-header-main">
                  {error ? "Could not get leader board" : "No users exist yet"}
                </Typography>
              )}
            </div>
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
