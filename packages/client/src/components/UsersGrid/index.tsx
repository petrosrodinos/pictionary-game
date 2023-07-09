import { FC } from "react";
import Typography from "../ui/Typography";
import Avatar from "../ui/Avatar";
import "./style.scss";

interface UsersGridProps {
  users: any[];
}

const UsersGrid: FC<UsersGridProps> = ({ users }) => {
  return (
    <div className="users-grid-container">
      {users.map((user, index) => (
        <div className="user-container" key={index}>
          <div className="user-content">
            <Avatar image={user.avatar} />
            <Typography>@{user.username}</Typography>
            <Typography>level:{user.level}</Typography>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UsersGrid;
