import { FC } from "react";
import Avatar from "../../../../components/ui/Avatar";
import Typography from "../../../../components/ui/Typography";
import "./style.scss";

interface PlayersProps {
  players: UserType[];
}

const Players: FC<PlayersProps> = ({ players }) => {
  return (
    <>
      <Typography variant="text-accent" className="rank-label">
        RANK
      </Typography>
      <div className="players-container">
        {players
          // .sort((a, b) => b.points - a.points)
          ?.map((player, index) => (
            <div key={index} className="player-container">
              <div className="players-content">
                <div className="player-rank">
                  <Typography>{index + 1}</Typography>
                </div>
                <Avatar image={player.avatar} />
                <div className="player-info">
                  <Typography variant="text-main">@{player.username}</Typography>
                  <Typography>points: {player.points}</Typography>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default Players;
