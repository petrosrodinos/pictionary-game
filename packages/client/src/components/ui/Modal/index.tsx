import { FC, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import Typography from "../Typography";
import { useTransition, animated } from "react-spring";
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

  const transitions = useTransition(isOpen, {
    from: { opacity: 0, transform: "translateY(-40px)" },
    enter: { opacity: 1, transform: "translateY(0)" },
    leave: { opacity: 0, transform: "translateY(-40px)" },
    config: { duration: 200 },
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return transitions(
    (styles, item) =>
      item && (
        <div className="modal__container">
          <animated.div style={styles} className="modal-content__container">
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
          </animated.div>
        </div>
      )
  );
};

export default Modal;
