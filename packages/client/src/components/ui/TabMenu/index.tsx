import { CSSProperties, FC } from "react";
import Typography from "../Typography";
import "./style.scss";

interface TabMenuProps {
  items: string[];
  name: string;
  selected: string;
  style?: CSSProperties;
  onChange: (data: { name: string; value: string }) => void;
}

const TabMenu: FC<TabMenuProps> = ({ items, name, selected, onChange, style }) => {
  return (
    <div style={style} className="wrapper">
      {items.map((item: string, index: number) => (
        <div
          onClick={() => {
            onChange({ name, value: item });
          }}
          key={index}
          className={`tab-menu-option-container ${selected == item ? "selected" : ""}`}
        >
          <div className="tab-menu-option">
            <Typography className="span">{item}</Typography>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TabMenu;
