import { FC } from "react";
import { useQuery } from "react-query";
import Register from "../../../pages/auth/register";
import { getUser } from "../../../services/user";
import { authStore } from "../../../store/authStore";
import Preferences from "./Settings";
import Spinner from "../../ui/Spinner";
import "./style.scss";

const EditProfile: FC = () => {
  const { userId } = authStore((state) => state);

  const { data, isLoading } = useQuery(["user", userId], () => getUser(userId));
  return (
    <div className="edit-info">
      <Preferences />
      <Spinner style={{ paddingTop: "5px" }} loading={isLoading} />
      {!isLoading && <Register values={data} isEditing={true} />}
    </div>
  );
};

export default EditProfile;
