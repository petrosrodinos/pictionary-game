import { FC } from "react";
import Avatar from "../../../../components/ui/Avatar";
import Typography from "../../../../components/ui/Typography";
import { UserType } from "../../../../interfaces/typing";
import { useTransition, animated } from "react-spring";
import { useTranslation } from "react-i18next";
import "./style.scss";

interface PlayersProps {
  players: UserType[];
}

const Players: FC<PlayersProps> = ({ players }) => {
  const { t } = useTranslation();
  const sortedPlayers = [...players].sort((a, b) => b.points - a.points);

  const transitions = useTransition(sortedPlayers, {
    key: (player: UserType) => player.username,
    from: { transform: "translateY(-20px)", opacity: 0 },
    enter: { transform: "translateY(0px)", opacity: 1 },
    leave: { transform: "translateY(-20px)", opacity: 0 },
    trail: 50,
    delay: 200,
  });

  return (
    <>
      <Typography variant="text-accent" className="rank-label">
        {t("rank")}
      </Typography>
      <div className="players-container">
        {transitions((style, player, _, index) => (
          <animated.div key={index} className="player-container" style={style}>
            <div className="players-content">
              <div className="player-rank">
                <Typography>{index + 1}</Typography>
              </div>
              <Avatar image={player.avatar} />
              <div className="player-info">
                <Typography variant="text-main">@{player.username}</Typography>
                <Typography>
                  {t("points")}: {player.points}
                </Typography>
              </div>
            </div>
          </animated.div>
        ))}
      </div>
    </>
  );
};

export default Players;
