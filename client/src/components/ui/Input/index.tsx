import { FC } from "react";
import Typography from "../Typography";
import "./style.scss";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value?: string | number;
  placeholder?: string;
  name?: string;
  type?: "text" | "password" | "email" | "number";
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: any;
  style?: React.CSSProperties;
  className?: string;
  register?: any;
  label?: string;
  props?: any;
}

const Input: FC<InputProps> = ({
  value,
  placeholder = "",
  name,
  type = "text",
  onChange,
  disabled,
  error,
  style,
  className = "",
  register,
  label,
  ...props
}) => {
  return (
    <div className={`input-container ${className}`} style={style}>
      {label && (
        <Typography variant="text-main" className="input-label">
          {label}
        </Typography>
      )}
      <input
        value={value}
        disabled={disabled}
        onChange={onChange}
        name={name}
        placeholder={placeholder}
        type={type}
        autoComplete="on"
        {...props}
        {...register?.(name)}
      ></input>
      {error && <Typography className="input-error">{error}</Typography>}
    </div>
  );
};

export default Input;
