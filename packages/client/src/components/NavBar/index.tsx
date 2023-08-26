import { FC, useState } from "react";
import PlayerStats from "./PlayerStats";
import Modal from "../ui/Modal";
import EditProfile from "./EditProfile";
import { FiSettings, FiPower } from "react-icons/fi";
import { authStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import LanguagePicker from "./LanguagePicker";
import "./style.scss";

const NavBar: FC = () => {
  const navigate = useNavigate();
  const { logOut } = authStore((state) => state);
  const [activeModal, setActiveModal] = useState<boolean>(false);

  const handleLogOut = () => {
    logOut();
    navigate("/login");
  };

  return (
    <div className="nav-bar-container">
      <Modal title="Edit Profile" onClose={() => setActiveModal(false)} isOpen={activeModal}>
        <EditProfile />
      </Modal>
      <PlayerStats />
      <div className="icons-container">
        <span onClick={() => setActiveModal(true)} className="nav-bar-icon">
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
