import { FC } from "react";
import Typography from "../../ui/Typography";
import Avatar from "../../ui/Avatar";
import { authStore } from "../../../store/authStore";
import Star from "../../ui/Star";
import "./style.scss";

interface PlayerStatsProps {
  style?: React.CSSProperties;
  className?: string;
}

const PlayerStats: FC<PlayerStatsProps> = ({ style, className = "" }) => {
  const { username, level, avatar, xp } = authStore((state) => state);
  return (
    <>
      <div className={`player-stats ${className}`} style={style}>
        <div className="user-stats-row">
          <Star label={level} />

          <Avatar image={avatar} />
          <div className="user-xp">
            <Typography variant="sub-header-main" className="user-xp-text">
              xp:{xp}
            </Typography>
          </div>
        </div>
        <div className="user-name">
          <Typography variant="sub-header-main" className="user-name-text">
            {username}
          </Typography>
        </div>
      </div>
    </>
  );
};

export default PlayerStats;
