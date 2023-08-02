import { FC, useState } from "react";
import Typography from "../Typography";
import "./style.scss";

interface ChipSelectorProps {
  chips: string[];
  onChange: (value: string) => void;
}

const ChipSelector: FC<ChipSelectorProps> = ({ chips, onChange }) => {
  const [selectedChip, setSelectedChip] = useState<string>("");

  const handleChange = (value: string) => {
    setSelectedChip(value);
    onChange(value);
  };
  return (
    <div className="chip-selector-container">
      {chips.map((chip, index) => (
        <div
          key={index}
          className={`chip-item ${selectedChip == chip ? "selected-chip" : ""}`}
          onClick={() => handleChange(chip)}
        >
          <Typography>{chip}</Typography>
        </div>
      ))}
    </div>
  );
};

export default ChipSelector;
