import { FC } from "react";
import { AiOutlineClose } from "react-icons/ai";
import "./style.scss";

interface IProps {
  children: any;
  isOpen: boolean;
  onClose: () => void;
}

const Modal: FC<IProps> = ({ children, isOpen, onClose }) => {
  const handleClick = (e: any) => {
    if (e.target.className === "modal__container") {
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <div onClick={handleClick} className="modal__container">
          <div className="modal-content__container">
            <div onClick={onClose} className="close-button">
              <AiOutlineClose />
            </div>
            <>{children}</>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
