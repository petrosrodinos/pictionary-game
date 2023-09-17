import { FC, useState, useEffect } from "react";
import Typography from "../Typography";
import { useTrail, animated } from "react-spring";
import { useTranslation } from "react-i18next";
import { AiOutlineClose } from "react-icons/ai";
import "./style.scss";

interface ChipSelectorProps {
  chips: string[];
  name?: string;
  value?: string;
  defaultValue?: boolean;
  disabled?: boolean;
  deletable?: boolean;
  selectable?: boolean;
  onChange?: (data: { name: string; value: string }) => void;
  onDeleteChip?: (data: { name: string; value: string }) => void;
  style?: React.CSSProperties;
}

const ChipSelector: FC<ChipSelectorProps> = ({
  chips,
  value,
  defaultValue,
  name,
  disabled,
  deletable,
  selectable = true,
  onChange,
  onDeleteChip,
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
    if (disabled || !selectable) return;
    setSelectedChip(value);
    onChange?.({
      name: name || "chip",
      value,
    });
  };

  const handleDeleteChip = (value: string) => {
    onDeleteChip?.({
      name: name || "chip",
      value: value,
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
          style={{ ...props }}
          className={`chip-item ${disabled ? "disabled-chip" : ""} ${
            selectedChip == chips[index] ? "selected-chip" : ""
          } ${selectable ? "selectable" : ""}`}
          onClick={() => {
            handleChange(chips[index]);
          }}
        >
          {deletable && (
            <span onClick={() => handleDeleteChip(chips[index])} className="deletable-chip">
              <AiOutlineClose />
            </span>
          )}
          <Typography>
            {t(`${name}.${chips[index]}`) == `${name}.${chips[index]}`
              ? chips[index]
              : t(`${name}.${chips[index]}`)}
          </Typography>
        </animated.div>
      ))}
    </div>
  );
};

export default ChipSelector;
