import { FC } from "react";
import Typography from "../ui/Typography";
import Avatar from "../ui/Avatar";
import { UserType } from "../../interfaces/typing";
import { useTransition, animated } from "react-spring";
import "./style.scss";

interface UsersGridProps {
  users: UserType[];
}

const UsersGrid: FC<UsersGridProps> = ({ users }) => {
  const connectedUsers = users.filter((user) => user.connected);
  const transitions = useTransition(connectedUsers, {
    key: (user: UserType) => user.username,
    from: { opacity: 0, transform: "scale(0.8)" },
    enter: { opacity: 1, transform: "scale(1)" },
    leave: { opacity: 0 },
  });

  return (
    <div className="users-grid-container">
      {transitions((style, user) => (
        <animated.div className="user-container" style={style}>
          <div className="user-content">
            <Avatar image={user.avatar} />
            <Typography className="user-username">@{user.username}</Typography>
            {user.level && <Typography>level:{user.level}</Typography>}
          </div>
        </animated.div>
      ))}
    </div>
  );
};

export default UsersGrid;
