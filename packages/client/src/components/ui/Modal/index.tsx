import { FC, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import Typography from "../Typography";
import "./style.scss";

interface IProps {
  children: any;
  isOpen: boolean;
  title?: string;
  onClose?: () => void;
}

const Modal: FC<IProps> = ({ children, isOpen, title, onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

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
            <div className="content-container">{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
