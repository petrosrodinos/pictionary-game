import { FC } from "react";
import Typography from "../ui/Typography";
import Avatar from "../ui/Avatar";
import "./style.scss";

interface UsersGridProps {
  users: UserType[];
}

const UsersGrid: FC<UsersGridProps> = ({ users }) => {
  return (
    <div className="users-grid-container">
      {users.map((user, index) => (
        <div className="user-container" key={index}>
          {user?.rank && (
            <div className="user-rank">
              <Typography>{user.rank}</Typography>
            </div>
          )}
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
