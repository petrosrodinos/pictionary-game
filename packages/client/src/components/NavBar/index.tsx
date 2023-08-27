import { FC, useState } from "react";
import PlayerStats from "./PlayerStats";
import Modal from "../ui/Modal";
import EditProfile from "./EditProfile";
import { FiSettings, FiPower } from "react-icons/fi";
import { authStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import LanguagePicker from "./LanguagePicker";
import { useSound } from "../../hooks/sound";
import "./style.scss";

const NavBar: FC = () => {
  const { play } = useSound();
  const navigate = useNavigate();
  const { logOut } = authStore((state) => state);
  const [activeModal, setActiveModal] = useState<boolean>(false);

  const handleLogOut = () => {
    logOut();
    navigate("/login");
  };

  const handleClick = () => {
    play("click");
    setActiveModal(true);
  };

  return (
    <div className="nav-bar-container">
      <Modal title="SETTINGS" onClose={() => setActiveModal(false)} isOpen={activeModal}>
        <EditProfile />
      </Modal>
      <PlayerStats />
      <div className="icons-container">
        <span onClick={handleClick} className="nav-bar-icon">
          <FiSettings />
        </span>
        <LanguagePicker />
        <span onClick={handleLogOut} className="nav-bar-icon">
          <FiPower />
        </span>
      </div>
    </div>
  );
};

export default NavBar;
