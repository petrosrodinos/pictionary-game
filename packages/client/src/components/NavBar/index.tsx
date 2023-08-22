import { FC } from "react";
import "./style.scss";
import PlayerStats from "./PlayerStats";

const NavBar: FC = () => {
  return (
    <div className="nav-bar-container">
      <PlayerStats />
    </div>
  );
};

export default NavBar;
