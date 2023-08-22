import { FC, useState } from "react";
import PlayerStats from "./PlayerStats";
import Modal from "../ui/Modal";
import EditProfile from "./EditProfile";
import { FiSettings, FiPower } from "react-icons/fi";
import { MdLanguage } from "react-icons/md";
import { authStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";
import "./style.scss";

const NavBar: FC = () => {
  const navigate = useNavigate();
  const { logOut } = authStore((state) => state);
  const [activeModal, setActiveModal] = useState<boolean>(false);

  const handleLogOut = () => {
    logOut();
    navigate("/user/login");
  };

  const handleChangeLanguage = () => {
    console.log("change language");
  };

  return (
    <div className="nav-bar-container">
      <Modal onClose={() => setActiveModal(false)} isOpen={activeModal}>
        <EditProfile />
      </Modal>
      <PlayerStats />
      <div className="icons-container">
        <span onClick={() => setActiveModal(true)} className="nav-bar-icon">
          <FiSettings />
        </span>
        <span onClick={handleChangeLanguage} className="nav-bar-icon">
          <MdLanguage />
        </span>
        <span onClick={handleLogOut} className="nav-bar-icon">
          <FiPower />
        </span>
      </div>
    </div>
  );
};

export default NavBar;
