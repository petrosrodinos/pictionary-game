import { FC } from "react";
import Typography from "../Typography";
import { ImSpinner6 } from "react-icons/im";
import "./style.scss";
import { useSound } from "../../../hooks/sound";

interface ButtonProps {
  title: string;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary";
  style?: any;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  icon?: any;
}

const Button: FC<ButtonProps> = ({
  variant = "primary",
  type = "button",
  style,
  onClick,
  className,
  title,
  disabled,
  loading,
  icon,
  ...props
}) => {
  const { play } = useSound();
  const Icon = icon;

  const handleClick = () => {
    play("click");
    onClick?.();
  };

  return (
    <button
      style={style}
      type={type}
      disabled={disabled}
      onClick={handleClick}
      className={`button-container button-${variant} ${className}`}
      {...props}
    >
      {icon && !loading && <Icon className="button-icon" />}
      {loading && <ImSpinner6 className="button-icon icon-loading" />}
      <Typography>{title}</Typography>
    </button>
  );
};

export default Button;
