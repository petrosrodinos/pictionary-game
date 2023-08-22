import { FC, useState } from "react";
import Typography from "../Typography";
import "./style.scss";

interface DatePickerProps {
  value?: string;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
  onChange?: (e: React.ChangeEvent<HTMLDataElement>) => void;
  error?: string;
  min?: string;
  max?: string;
}

const getDate = (date?: string): string => {
  try {
    if (date) {
      const [day, month, year] = date.split("/");
      const formattedDate = `${year}-${month}-${day}`;
      return new Date(formattedDate).toISOString().slice(0, 10);
    }
    return new Date().toISOString().slice(0, 10);
  } catch (e) {
    return new Date().toISOString().slice(0, 10);
  }
};

const DatePicker: FC<DatePickerProps> = ({
  className = "",
  style,
  error,
  onChange,
  value,
  min,
  max,
  label,
}) => {
  const [dateValue, setDateValue] = useState(getDate(value));

  const handleDateChange = (event: any) => {
    setDateValue(event.target.value);
    onChange && onChange(event);
  };

  return (
    <div className={`datepicker ${className}`} style={style}>
      {label && (
        <Typography variant="text-main" className="input-label">
          {label}
        </Typography>
      )}
      <input
        min={min}
        max={max}
        value={dateValue}
        className="dateInput"
        type="date"
        onChange={handleDateChange}
      ></input>
      {error && <Typography className="input-error">{error}</Typography>}
    </div>
  );
};

export default DatePicker;
