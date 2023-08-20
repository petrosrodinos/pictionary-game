import { FC, useState } from "react";
import { BrushSizes, PalletColors } from "../../../../constants/game";
import { AiOutlineClear } from "react-icons/ai";
import { MdOutlineColorLens } from "react-icons/md";
import { ChromePicker } from "react-color";
import { BsEraser } from "react-icons/bs";
import "./style.scss";

interface DrawingOptionsProps {
  onColorChange: (color: string) => void;
  onBrashSizeChange: (size: number) => void;
  onClear: () => void;
  onFingerDraw: () => void;
  color: string;
  brushSize: number;
}

const DrawingOptions: FC<DrawingOptionsProps> = ({
  onColorChange,
  onBrashSizeChange,
  onClear,
  onFingerDraw,
  color,
  brushSize,
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
              className={`pallet-item ${color == c ? "selected-item" : ""}`}
              style={{ backgroundColor: c }}
              onClick={() => onColorChange(c)}
            />
          ))}
          <AiOutlineClear onClick={onClear} className="pallet-icon pallet-item" />
          <MdOutlineColorLens className="pallet-icon pallet-item" onClick={handleClick} />
          <BsEraser
            onClick={() => onColorChange(PalletColors[1])}
            className="pallet-icon pallet-item"
          />
          {showColorPicker && (
            <div className="popover">
              <div className="cover" onClick={handleClose} />
              <ChromePicker onChange={(c) => onColorChange(c.hex)} color={color} />
            </div>
          )}
          <div className="brush-sizes-container">
            {BrushSizes.map((size, index) => (
              <div
                key={index}
                className={`pallet-item ${brushSize == size ? "selected-item" : ""}`}
                style={{ width: size + 4, height: size + 4, backgroundColor: color }}
                onClick={() => onBrashSizeChange(size)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawingOptions;
