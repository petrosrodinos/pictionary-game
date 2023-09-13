import { FC, useState, useEffect } from "react";
import Typography from "../Typography";
import { useTrail, animated } from "react-spring";
import { useTranslation } from "react-i18next";
import { CATEGORIES } from "../../../constants/game";
import "./style.scss";

interface ChipSelectorProps {
  chips: string[];
  name?: string;
  value?: string;
  defaultValue?: boolean;
  disabled?: boolean;
  translate?: boolean;
  onChange?: (data: { name: string; value: string }) => void;
  style?: React.CSSProperties;
}

const ChipSelector: FC<ChipSelectorProps> = ({
  chips,
  value,
  defaultValue,
  name,
  disabled,
  translate = true,
  onChange,
  style,
}) => {
  const { t } = useTranslation();
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
    if (disabled) return;
    setSelectedChip(value);
    onChange?.({
      name: name || "chip",
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
          className={`chip-item ${disabled ? "disabled-chip" : ""} ${
            selectedChip == chips[index] ? "selected-chip" : ""
          }`}
          onClick={() => {
            handleChange(chips[index]);
          }}
        >
          <Typography>
            {CATEGORIES.length < chips.length
              ? index == chips.length - 1
                ? chips[index]
                : t(`${name}.${chips[index]}`)
              : translate
              ? t(`${name}.${chips[index]}`)
              : chips[index]}
          </Typography>
        </animated.div>
      ))}
    </div>
  );
};

export default ChipSelector;
