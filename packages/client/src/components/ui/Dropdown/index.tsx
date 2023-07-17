import { FC } from "react";
import "./style.scss";
//import Typography from "../Typography";

//types
interface DropdownProps { //props gia to button
  value?: string;
  style?: React.CSSProperties;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
 
}



const Dropdown: FC<DropdownProps> = ({
  //parametroi
  style,
  className = "",
  onChange

}) => {
    return (
      <div className={`dropdown ${className}`} style={style}>
        <select onChange={onChange} >
          
          <option value="1">Role</option>
          <option value="2">Student</option>
          <option value="3">Teacher</option>
          <option value="4">Parent</option>
        </select>       
      </div>
      
  );
};



export default Dropdown;