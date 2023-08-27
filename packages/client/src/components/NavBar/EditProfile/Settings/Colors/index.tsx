import { FC } from "react";
import { configStore } from "../../../../../store/config";
import "./style.scss";
import ColorPicker from "./ColorPicker";

const Colors: FC = () => {
  const { config, setConfig } = configStore((state) => state);
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
    <div className="colors-container">
      <ColorPicker
        name="--primary-background-color-rgba"
        color="red"
        label="primary"
        onChange={handleChange}
      />
    </div>
  );
};

export default Colors;
