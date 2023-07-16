import { FC } from "react";
import "./style.scss";
import Typography from "../Typography";


interface DropdownProps { //props gia to button
  style?: React.CSSProperties;
  className?: string;
  error?: string;
  //onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}



const  Dropdown: FC<DropdownProps> = ({
  style,
  className = "",
  error,
  //onChange,

}) => {
    return (
    <div className={`dropdown${className}`} style={style}>
        <select >
          <option value="1">USER TYPE</option>
          <option value="2">student</option>
          <option value="3">teacher</option>
          <option value="4">parent</option>
        </select> 
        {error && <Typography className="input-error">{error}</Typography>}
    </div>
  );
};

export default Dropdown;