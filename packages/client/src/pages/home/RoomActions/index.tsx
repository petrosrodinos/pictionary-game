import { FC } from "react";
import "./style.scss";
import Button from "../../../components/ui/Button";

interface RoomActionsProps {
  onActionClick: (action: string) => void;
}

const RoomActions: FC<RoomActionsProps> = ({ onActionClick }) => {
  return (
    <div className="room-actions-container">
      <Button title="JOIN ROOM" onClick={() => onActionClick("join")} />
      <Button variant="secondary" title="CREATE ROOM" onClick={() => onActionClick("create")} />
    </div>
  );
};

export default RoomActions;
