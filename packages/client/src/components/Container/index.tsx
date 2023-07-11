import { FC } from "react";
import "./style.scss";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container: FC<ContainerProps> = ({ children, className }) => {
  return <div className={`main-content-container ${className}`}>{children}</div>;
};

export default Container;
