import { CSSProperties, FC } from "react";
import Typography from "../Typography";
import "./style.scss";

interface TabMenuProps {
  items: { label: string; value: string }[];
  name: string;
  selected: string;
  style?: CSSProperties;
  className?: string;
  onChange: (data: { name: string; value: string }) => void;
}

const TabMenu: FC<TabMenuProps> = ({ items, name, selected, onChange, style, className = "" }) => {
  return (
    <div className={`wrapper ${className}`} style={style}>
      {items.map((item, index: number) => (
        <div
          onClick={() => {
            onChange({ name, value: item.value });
          }}
          key={index}
          className={`tab-menu-option-container ${selected == item.value ? "selected-tab" : ""}`}
        >
          <div className="tab-menu-option">
            <Typography className="span">{item.label}</Typography>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TabMenu;
