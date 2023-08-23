import { FC } from "react";
import Typography from "../ui/Typography";
import Avatar from "../ui/Avatar";
import { UserType } from "../../interfaces/typing";
import "./style.scss";

interface UsersGridProps {
  users: UserType[];
}

const UsersGrid: FC<UsersGridProps> = ({ users }) => {
  return (
    <div className="users-grid-container">
      {users
        .filter((user) => user.connected)
        .map((user, index) => (
          <div className="user-container" key={index}>
            <div className="user-content">
              <Avatar image={user.avatar} />
              <Typography className="user-username">@{user.username}</Typography>
              {user.level && <Typography>level:{user.level}</Typography>}
            </div>
          </div>
        ))}
    </div>
  );
};

export default UsersGrid;
