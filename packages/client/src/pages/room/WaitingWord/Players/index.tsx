import { FC } from "react";
import Avatar from "../../../../components/ui/Avatar";
import Typography from "../../../../components/ui/Typography";
import "./style.scss";

interface PlayersProps {
  players: InGameUser[];
}

const Players: FC<PlayersProps> = ({ players }) => {
  return (
    <div className="players-container">
      {players.map((player, index) => (
        <div className="player-container">
          <div className="players-content">
            <div className="player-rank">
              <Typography>{index}</Typography>
            </div>
            <Avatar image={player.avatar} />
            <div className="player-info">
              <Typography variant="text-main">{player.username}</Typography>
              <Typography>points: {player.points}</Typography>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Players;
