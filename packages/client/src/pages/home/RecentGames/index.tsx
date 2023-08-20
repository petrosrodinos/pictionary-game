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
    <div className="recent-leader-board-container">
      <div className="recent-games-label">
        <Typography variant="header-main">My Recent Games</Typography>
      </div>
      {isLoading && <span>loading</span>}
      <div className="recent-games-content">
        {data?.games?.map((item: any, index: number) => {
          return <RecentGamesItem key={index} item={item} />;
        })}
      </div>
    </div>
  );
};

export default RecentGames;
