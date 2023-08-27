import { FC, useState } from "react";
import { SketchPicker } from "react-color";
import Typography from "../../../../../ui/Typography";
import "./style.scss";

interface ColorPickerProps {
  label: string;
  color: string;
  name: string;
  onChange: (value: { name: string; color: string }) => void;
}

const ColorPicker: FC<ColorPickerProps> = ({ label, color, name, onChange }) => {
  const [open, setOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(color);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (color: any) => {
    setSelectedColor(color.hex);
    onChange({
      name,
      color: color.hex,
    });
  };

  return (
    <div>
      <Typography>{label}</Typography>
      <div className="swatch" onClick={handleClick}>
        <div
          className="color"
          style={{
            backgroundColor: color,
          }}
        />
      </div>
      {open && (
        <div className="popover">
          <div className="cover" onClick={handleClose} />
          <SketchPicker onChange={handleChange} color={selectedColor} />
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
