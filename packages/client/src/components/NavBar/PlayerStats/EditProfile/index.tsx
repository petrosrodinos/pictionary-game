import { FC } from "react";
import { useQuery } from "react-query";
import Register from "../../../../pages/auth/register";
import { getUser } from "../../../../services/user";
import { authStore } from "../../../../store/authStore";
import "./style.scss";

const EditProfile: FC = () => {
  const { userId } = authStore((state) => state);

  const { data } = useQuery(["user", userId], () => getUser(userId));
  return (
    <div className="edit-info">
      <Register values={data} isEditing={true} />
    </div>
  );
};

export default EditProfile;
