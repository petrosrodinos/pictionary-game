import { FC } from "react";
import { configStore } from "../../../../../store/config";
import ColorPicker from "./ColorPicker";
import Typography from "../../../../ui/Typography";
import Button from "../../../../ui/Button";
import "./style.scss";

const Colors: FC = () => {
  const { config, setConfig, resetColors } = configStore((state) => state);
  var root: any = document.querySelector(":root");

  const handleChange = (value: { name: string; color: string }) => {
    root?.style?.setProperty(value.name, value.color);
    setConfig({
      ...config,
      colors: {
        ...config.colors,
        [value.name]: value.color,
      },
    });
  };

  return (
    <div className="colors-main-container">
      <Typography variant="sub-header-main">Colors:</Typography>
      <div className="colors-container">
        {Object.keys(config.colors).map((key, index) => (
          <ColorPicker
            key={index}
            name={key}
            color={config.colors[key]}
            label={key.replace("--", "")}
            onChange={handleChange}
          />
        ))}
      </div>
      <Button title="Reset" onClick={resetColors} />
    </div>
  );
};

export default Colors;
