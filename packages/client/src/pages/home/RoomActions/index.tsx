import { FC } from "react";
import Button from "../../../components/ui/Button";
import { ModalType } from "..";
import { useTranslation } from "react-i18next";
import { useSound } from "../../../hooks/sound";
import "./style.scss";

interface RoomActionsProps {
  onActionClick: (action: ModalType) => void;
}

const RoomActions: FC<RoomActionsProps> = ({ onActionClick }) => {
  const { t } = useTranslation();
  return (
    <div className="room-actions-container">
      <Button
        title={t("join-room")}
        onClick={() => {
          onActionClick("join-room");
        }}
      />
      <Button
        variant="secondary"
        title={t("create-room")}
        onClick={() => onActionClick("create-room")}
      />
    </div>
  );
};

export default RoomActions;
