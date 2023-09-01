import { FC, useState, useEffect } from "react";
import Typography from "../Typography";
import { useTrail, animated } from "react-spring";
import "./style.scss";

interface ChipSelectorProps {
  chips: string[];
  name: string;
  value?: string;
  defaultValue?: boolean;
  onChange: (data: { name: string; value: string }) => void;
  style?: React.CSSProperties;
}

const ChipSelector: FC<ChipSelectorProps> = ({
  chips,
  value,
  defaultValue,
  name,
  onChange,
  style,
}) => {
  const [selectedChip, setSelectedChip] = useState<string>("");

  useEffect(() => {
    if (value) {
      setSelectedChip(value);
    }
    if (defaultValue) {
      setSelectedChip(chips[0]);
    }
  }, [value]);

  const handleChange = (value: string) => {
    setSelectedChip(value);
    onChange({
      name,
      value,
    });
  };

  const trail = useTrail(chips.length, {
    from: { transform: "rotate3d(1, 0, 0, -90deg)", opacity: 0 },
    to: { transform: "rotate3d(1, 0, 0, 0deg)", opacity: 1 },
    config: { tension: 280, friction: 30 },
  });

  return (
    <div style={style} className="chip-selector-container">
      {trail.map((props, index) => (
        <animated.div
          key={index}
          style={props}
          className={`chip-item ${selectedChip == chips[index] ? "selected-chip" : ""}`}
          onClick={() => handleChange(chips[index])}
        >
          <Typography>{chips[index]}</Typography>
        </animated.div>
      ))}
    </div>
  );
};

export default ChipSelector;
