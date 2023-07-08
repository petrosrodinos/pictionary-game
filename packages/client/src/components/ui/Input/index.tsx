import { FC } from "react";
import Typography from "../Typography";
import "./style.scss";

interface InputProps {
  value?: string;
  placeholder?: string;
  name: string;
  type?: "text" | "password" | "email" | "number";
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: string;
  style?: React.CSSProperties;
  className?: string;
}

const Input: FC<InputProps> = ({
  value = "",
  placeholder = "",
  name,
  type = "text",
  onChange,
  disabled,
  error,
  style,
  className,
}) => {
  return (
    <div className={`input-container ${className}`} style={style}>
      <input
        value={value}
        disabled={disabled}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        type={type}
      ></input>
      {error && <Typography className="input-error">{error}</Typography>}
    </div>
  );
};

export default Input;
