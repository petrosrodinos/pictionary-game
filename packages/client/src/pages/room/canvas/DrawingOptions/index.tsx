import { FC, useState } from "react";
import { PalletColors } from "../../../../constants/game";
import { AiOutlineClear } from "react-icons/ai";
import { MdOutlineColorLens } from "react-icons/md";
import { ChromePicker } from "react-color";
import "./style.scss";

interface DrawingOptionsProps {
  onColorChange: (color: string) => void;
  onClear: () => void;
  onFingerDraw: () => void;
  color: string;
}

const DrawingOptions: FC<DrawingOptionsProps> = ({
  onColorChange,
  onClear,
  onFingerDraw,
  color,
}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleClick = () => {
    setShowColorPicker(true);
  };

  const handleClose = () => {
    setShowColorPicker(false);
  };
  return (
    <div className="canvas-options-container">
      <div className="canvas-options">
        <div className="colors-container">
          {PalletColors.map((c, index) => (
            <div
              key={index}
              className={`pallet-item ${color == c ? "selected-color" : ""}`}
              style={{ backgroundColor: c }}
              onClick={() => onColorChange(c)}
            />
          ))}
          <AiOutlineClear onClick={onClear} className="pallet-icon pallet-item" />
          <MdOutlineColorLens className="pallet-icon pallet-item" onClick={handleClick} />
          {showColorPicker && (
            <div className="popover">
              <div className="cover" onClick={handleClose} />
              <ChromePicker onChange={(c) => onColorChange(c.hex)} color={color} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DrawingOptions;
