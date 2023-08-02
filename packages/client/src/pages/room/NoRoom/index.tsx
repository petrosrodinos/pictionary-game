import { FC } from "react";
import Button from "../../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import "./style.scss";

const NoRoom: FC = () => {
  const navigate = useNavigate();
  return (
    <div className="no-room-container">
      <Button title="GO BACK TO HOME PAGE" onClick={() => navigate("/home")} />
    </div>
  );
};

export default NoRoom;
