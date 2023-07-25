import { FC } from "react";
import "./style.scss";
//import Typography from "../Typography";

//types
interface DropdownProps { //props gia to button
  value?: string;
  style?: React.CSSProperties;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}



const Dropdown: FC<DropdownProps> = ({
  style,
  className = '',
  onChange,
  options,
}) => {
  return (
    <div className={`dropdown ${className}`} style={style}>
      <select onChange={onChange} className='dropdownSelect'>
        {options.map((option) => (
          <option key={option.value} value={option.value} className='dropdownOption'>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};


export default Dropdown;