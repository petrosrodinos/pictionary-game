import { FC } from "react";
import Typography from "../../../components/ui/Typography";
import RecentGamesItem from "./Item";
import { useQuery } from "react-query";
import { getUser } from "../../../services/user";
import { authStore } from "../../../store/authStore";
import "./style.scss";

const RecentGames: FC = () => {
  const { userId } = authStore((state) => state);
  const { isLoading, data } = useQuery(
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
      {isLoading && <span>loading</span>}
      <div className="recent-games-content-container">
        <div className="recent-games-content">
          {data?.games?.map((item: any, index: number) => {
            return <RecentGamesItem key={index} item={item} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default RecentGames;
