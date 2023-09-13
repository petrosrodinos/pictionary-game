import { FC, useState, useEffect } from "react";
import Typography from "../Typography";
import "./style.scss";

interface DatePickerProps {
  value?: string;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
  onChange?: (e: React.ChangeEvent<HTMLDataElement>) => void;
  error?: any;
  min?: string;
  max?: string;
}

// const isValidDate = (d: Date) => {
//   return d instanceof Date && !isNaN(d.getTime());
// };

// const getDate = (date?: string): string => {
//   try {
//     if (date) {
//       const [day, month, year] = date.split("-");
//       const formattedDate = `${year}-${month}-${day}`;
//       const parsedDate = new Date(formattedDate);
//       if (!isValidDate(parsedDate)) {
//         console.error("Invalid date value:", date);
//         return new Date().toISOString().slice(0, 10);
//       }
//       return parsedDate.toISOString().slice(0, 10);
//     }
//     return new Date().toISOString().slice(0, 10);
//   } catch (e) {
//     console.log(e);
//     return new Date().toISOString().slice(0, 10);
//   }
// };

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
  const [dateValue, setDateValue] = useState("");

  useEffect(() => {
    if (value) {
      setDateValue(value);
    }
  }, [value]);

  const handleDateChange = (event: any) => {
    setDateValue(event.target.value);
    onChange?.(event);
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
