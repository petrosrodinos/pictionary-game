import { FC } from "react";
import { AiOutlineClose } from "react-icons/ai";
import "./style.scss";

interface IProps {
  children: any;
  isOpen: boolean;
  onClose: () => void;
}

const Modal: FC<IProps> = ({ children, isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div className="modal__container">
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
