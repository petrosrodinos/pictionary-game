import { FC } from "react";
import Typography from "../Typography";
import "./style.scss";

interface DatePickerProps {
  value?: string;
  className?: string;
  style?: React.CSSProperties;
  onChange?: (e: React.ChangeEvent<HTMLDataElement>) => void;
  error?: string;
}

const DatePicker: FC<DatePickerProps> = ({ className = "", style, error, onChange, value }) => {
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
  return (
    <div className={`datepicker ${className}`} style={style}>
      <input value={getDate(value)} className="dateInput" type="date" onChange={onChange}></input>
      {error && <Typography className="input-error">{error}</Typography>}
    </div>
  );
};

export default DatePicker;
