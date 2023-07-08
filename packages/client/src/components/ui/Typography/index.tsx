import { FC } from "react";
import "./style.scss";

interface TypographyProps {
  className?: string;
  variant?: string;
  style?: any;
  children: any;
  onClick?: () => void;
}

const Typography: FC<TypographyProps> = ({
  className = "",
  style,
  children,
  variant = "",
  onClick,
}) => {
  return (
    <span onClick={onClick} style={style} className={`typography ${variant} ${className}`}>
      {children}
    </span>
  );
};

export default Typography;
