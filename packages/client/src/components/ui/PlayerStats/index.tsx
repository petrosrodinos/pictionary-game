import {
  FC,
  // useState
} from "react";
import "./style.scss";
import Typography from "../Typography";
import Avatar from "../Avatar";
import StarLevelImage from "../../../assets/player-level-star.png";
//import initialStateValues from "../../../home/store";
import { authStore, getAuthState } from "../../../store/authStore";
interface PlayerStatsProps {
  style?: React.CSSProperties;
  className?: string;
}

const PlayerStats: FC<PlayerStatsProps> = ({
  // prama,
  style,
  className = "",
}) => {
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
                {/* {getAuthState.level} */}3
              </Typography>
            </div>
          </div>
          <div className="user-image">
            <Avatar
              image={`https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80`}
            />
          </div>
          <div className="user-xp">
            <Typography variant="small-text-accent" className="user-xp-text">
              xp:200
            </Typography>
          </div>
        </div>
        <div className="user-name">
          <Typography variant="small-text-main" className="user-name-text">
            Όνομα Χρήστη
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;
