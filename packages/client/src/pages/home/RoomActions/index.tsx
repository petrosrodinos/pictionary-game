import { FC } from "react";
import Button from "../../../components/ui/Button";
import { ModalType } from "..";
import "./style.scss";

interface RoomActionsProps {
  onActionClick: (action: ModalType) => void;
}

const RoomActions: FC<RoomActionsProps> = ({ onActionClick }) => {
  return (
    <div className="room-actions-container">
      <Button title="JOIN ROOM" onClick={() => onActionClick("join-room")} />
      <Button
        variant="secondary"
        title="CREATE ROOM"
        onClick={() => onActionClick("create-room")}
      />
    </div>
  );
};

export default RoomActions;
