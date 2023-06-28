import { FC } from "react";
import { trpc } from "../../lib/trpc";

const Users: FC = () => {
  const { data, isLoading } = trpc.auth.getUsers.useQuery();

  return (
    <div>
      <h1>users</h1>
      {data && (
        <>
          {data.map((user, index) => (
            <ul key={index}>
              <li>{user.name}</li>
              <li>{user.email}</li>
            </ul>
          ))}
        </>
      )}
      {isLoading && <div>loading...</div>}
    </div>
  );
};

export default Users;
