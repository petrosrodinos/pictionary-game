import { FC } from "react";
import "./style.scss";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Container: FC<ContainerProps> = ({ children, className = "", style }) => {
  return (
    <div style={style} className={`main-content-container ${className}`}>
      {children}
    </div>
  );
};

export default Container;
