import {
  FC,
  // useState
} from "react";
import "./style.scss";
import Typography from "../Typography";
import Avatar from "../Avatar";
import StarLevelImage from "../../../assets/player-level-star.png";
//import initialStateValues from "../../../home/store";
import { authStore } from "../../../store/authStore";

interface PlayerStatsProps {
  style?: React.CSSProperties;
  className?: string;
}

const PlayerStats: FC<PlayerStatsProps> = ({
  // prama,
  style,
  className = "",
}) => {
  const { username, level, avatar, points } = authStore((state) => state);
  return (
    <div className={`player-stats ${className}`} style={style}>
      <div className="user-stats-column">
        <div className="user-stats-row">
          <div className="player-level">
            <div className="star-level">
              <img src={StarLevelImage} className="star-level-image" />
            </div>

            <div className="level-number">
              <Typography variant="text-accent" className="level-text">
                {level}
              </Typography>
            </div>
          </div>
          <div className="user-image">
            <Avatar image={avatar} />
          </div>
          <div className="user-xp">
            <Typography variant="small-text-accent" className="user-xp-text">
              xp:{points}
            </Typography>
          </div>
        </div>
        <div className="user-name">
          <Typography variant="small-text-main" className="user-name-text">
            {username}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;
