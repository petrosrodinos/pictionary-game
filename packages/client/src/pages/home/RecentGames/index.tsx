import { FC } from "react";
import Typography from "../../../components/ui/Typography";
import RecentGamesItem from "./Item";
import { useQuery } from "react-query";
import { getUser } from "../../../services/user";
import { authStore } from "../../../store/authStore";
import Spinner from "../../../components/ui/Spinner";
import "./style.scss";

const RecentGames: FC = () => {
  const { userId } = authStore((state) => state);
  const { isLoading, data, error } = useQuery(
    "get-user",
    () => {
      return getUser(userId);
    },
    {
      enabled: !!userId,
    }
  );

  return (
    <div className="recent-games-container">
      <Typography variant="header-main" className="recent-games-label">
        My Recent Games
      </Typography>
      <div className="recent-games-content-container">
        <div className="recent-games-content">
          {data?.games?.map((item: any, index: number) => {
            return <RecentGamesItem key={index} item={item} />;
          })}
        </div>
        {(!data || data.games.length == 0) && (
          <div style={{ overflow: "hidden" }} className="no-games-exist">
            <Spinner style={{ margin: "5px" }} loading={isLoading} />
            {!isLoading && (
              <Typography variant="sub-header-main">
                {error ? "Could not get your recent games" : "You have not played any games yet"}
              </Typography>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentGames;
