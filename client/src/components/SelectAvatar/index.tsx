import { FC, useState, useEffect } from "react";
import { getRandomAvatar } from "../../utils/avatar";
import "./style.scss";
import { convertBase64 } from "../../utils/image";

interface SelectAvatarProps {
  value?: File | string;
  onChange: (value: any) => void;
}

const SelectAvatar: FC<SelectAvatarProps> = ({ onChange, value }) => {
  const [selectedAvatar, setSelectedAvatar] = useState<number>();
  const [avatars, setAvatars] = useState<string[]>([]);

  useEffect(() => {
    setUpAvatars();
  }, [value]);

  const setUpAvatars = async () => {
    let avatars = [...Array(35)].map((_) => getRandomAvatar());
    if (value && typeof value == "object") {
      const base64 = await convertBase64(value);
      avatars.splice(0, 1, base64);
    } else if (value && typeof value == "string") {
      avatars.splice(0, 1, value);
    }
    setSelectedAvatar(0);
    setAvatars(avatars);
  };

  const handleAvatarChange = async (index: number) => {
    setSelectedAvatar(index);
    // const avatarFile = await convertStringUrlToFile(avatars[index]);
    onChange({
      file: "",
      image: avatars[index],
    });
  };

  return (
    <div className="select-avatar-container">
      <div className="select-avatar-content">
        {avatars?.map((avatar, index) => (
          <div
            onClick={() => handleAvatarChange(index)}
            key={index}
            className={`avatar-container ${selectedAvatar == index ? "selected-avatar" : ""}`}
          >
            <img className="avatar-image" src={avatar} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectAvatar;
