import { FC } from "react";
import { getRandomAvatar } from "../../utils/avatar";
import "./style.scss";

interface SelectAvatarProps {
  onChange: (value: string) => void;
}

const SelectAvatar: FC<SelectAvatarProps> = () => {
  return (
    <div className="select-avatar-container">
      <div className="select-avatar-content">
        {[...Array(30)].map((_, index) => (
          <div key={index} className="avatar-container">
            <img className="avatar-image" src={getRandomAvatar()} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectAvatar;
