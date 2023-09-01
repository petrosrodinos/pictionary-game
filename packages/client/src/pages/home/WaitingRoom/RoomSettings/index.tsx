import { FC } from "react";
import Typography from "../../../../components/ui/Typography";
import { RoomInfo } from "../../../../interfaces/typing";
import { useTrail, animated } from "react-spring";
import "./style.scss";

interface RoomSettingsProps {
  roomInfo: RoomInfo;
}

const RoomSettings: FC<RoomSettingsProps> = ({ roomInfo }) => {
  const items = [
    { label: "CATEGORY:", stat: roomInfo.category },
    { label: "DIFFICULTY:", stat: roomInfo.difficalty },
    { label: "MAX PLAYERS:", stat: roomInfo.maxPlayers },
    { label: "ROUND TIME:", stat: `${roomInfo.roundTime / 1000} (s)` },
    { label: "CHOOSING WORD TIME:", stat: `${roomInfo.choosingWordTime / 1000} (s)` },
  ];

  const trail = useTrail(items.length, {
    from: { transform: "translateY(20px)", opacity: 0 },
    to: { transform: "translateY(0)", opacity: 1 },
    config: { tension: 180, friction: 30 },
  });

  return (
    <div className="settings-container">
      <Typography className="settings-label" variant="header-main">
        Settings
      </Typography>
      <div className="settings-content">
        {trail.map((style, index) => (
          <animated.div key={index} style={style}>
            <Typography>
              <Typography variant="text-accent" className="waiting-room-label">
                {items[index].label}
              </Typography>
              <Typography variant="text-main" className="room-stat">
                {items[index].stat}
              </Typography>
            </Typography>
          </animated.div>
        ))}
      </div>
    </div>
  );
};

export default RoomSettings;
