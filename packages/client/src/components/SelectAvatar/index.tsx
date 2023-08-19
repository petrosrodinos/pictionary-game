import { FC, useState, useEffect } from "react";
import { getRandomAvatar } from "../../utils/avatar";
import "./style.scss";

interface SelectAvatarProps {
  value?: string;
  onChange: (value: string) => void;
}

const SelectAvatar: FC<SelectAvatarProps> = ({ onChange, value }) => {
  const [selectedAvatar, setSelectedAvatar] = useState<number>();
  const [avatars, setAvatars] = useState<string[]>([]);

  useEffect(() => {
    let avatars = [...Array(30)].map((_) => getRandomAvatar());
    if (value) {
      avatars.splice(0, 1, value);
      setSelectedAvatar(0);
    }
    setAvatars(avatars);
  }, []);

  const handleAvatarChange = (index: number) => {
    setSelectedAvatar(index);
    onChange(avatars[index]);
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
