import { FC } from "react";
import "./style.scss";

interface TypographyProps {
  className?: string;
  variant?: string;
  style?: any;
  children: any;
}

const Typography: FC<TypographyProps> = ({ className, style, children, variant }) => {
  return (
    <span style={style} className={`typography ${variant} ${className}`}>
      {children}
    </span>
  );
};

export default Typography;
