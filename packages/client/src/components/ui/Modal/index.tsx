import { FC } from "react";
import "./style.scss";

interface ModalProps {
  onClose: () => void;
  isOpen: boolean;
  children: any;
  style?: any;
  className?: string;
}

const Modal: FC<ModalProps> = ({ onClose, isOpen, children, style = {}, className = "" }) => {
  return (
    <>
      {isOpen && (
        <div style={style} className={`${className} modal-container`}>
          <div className="modal-content">{children}</div>
        </div>
      )}
    </>
  );
};

export default Modal;
