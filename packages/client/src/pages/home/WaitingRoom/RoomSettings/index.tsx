import { FC } from "react";
import Typography from "../../../../components/ui/Typography";
import { RoomInfo } from "../../../../interfaces/typing";
import { useTrail, animated } from "react-spring";
import { useTranslation } from "react-i18next";
import "./style.scss";

interface RoomSettingsProps {
  roomInfo: RoomInfo;
}

const RoomSettings: FC<RoomSettingsProps> = ({ roomInfo }) => {
  const { t } = useTranslation();
  const items = [
    { label: t("CATEGORY"), stat: t(`category.${roomInfo.category}`) },
    { label: t("DIFFICULTY"), stat: t(`difficalty.${roomInfo.difficalty}`) },
    { label: t("MAX-PLAYERS"), stat: roomInfo.maxPlayers },
    { label: t("ROUND-TIME"), stat: `${roomInfo.roundTime / 1000} (s)` },
    { label: t("CHOOSING-WORD-TIME"), stat: `${roomInfo.choosingWordTime / 1000} (s)` },
  ];

  const trail = useTrail(items.length, {
    from: { transform: "translateY(20px)", opacity: 0 },
    to: { transform: "translateY(0)", opacity: 1 },
    config: { tension: 180, friction: 30 },
  });

  return (
    <div className="settings-container">
      <Typography className="settings-label" variant="header-main">
        {t("settings")}
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
