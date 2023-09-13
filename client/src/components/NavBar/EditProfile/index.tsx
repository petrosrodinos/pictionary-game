import { FC, useState } from "react";
import { useQuery } from "react-query";
import Register from "../../../pages/auth/register";
import { getUser } from "../../../services/user";
import { authStore } from "../../../store/authStore";
import Preferences from "./Settings";
import Spinner from "../../ui/Spinner";
import TabMenu from "../../ui/TabMenu";
import "./style.scss";

const EditProfile: FC = () => {
  const { userId } = authStore((state) => state);
  const { data, isLoading } = useQuery(["user", userId], () => getUser(userId));
  const [selected, setSelected] = useState<string>("profile");

  const items = [
    { label: "Profile", value: "profile" },
    { label: "Preferences", value: "preferences" },
  ];

  const handleChange = (item: { name: string; value: string }) => {
    setSelected(item.value);
  };

  const panels: any = {
    profile: <Register values={data} isEditing={true} />,
    preferences: <Preferences />,
  };

  return (
    <div className="edit-info">
      <TabMenu selected={selected} name="type" items={items} onChange={handleChange} />
      <Spinner style={{ paddingTop: "5px" }} loading={isLoading} />
      {panels[selected]}
    </div>
  );
};

export default EditProfile;
