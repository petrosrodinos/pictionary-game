import { FC } from "react";
import { AiOutlineClose } from "react-icons/ai";
import "./style.scss";
import Typography from "../Typography";

interface IProps {
  children: any;
  isOpen: boolean;
  title?: string;
  onClose?: () => void;
}

const Modal: FC<IProps> = ({ children, isOpen, title, onClose }) => {
  return (
    <>
      {isOpen && (
        <div className="modal__container">
          <div className="modal-content__container">
            {onClose && (
              <div onClick={onClose} className="close-button">
                <AiOutlineClose />
              </div>
            )}
            {title && (
              <div className="title-container">
                <Typography variant="text-main">{title}</Typography>
              </div>
            )}
            <>{children}</>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
