import { FC } from "react";
import { configStore } from "../../../../store/config";
import Typography from "../../../ui/Typography";
import SoundIcon from "../../../../assets/icons/sound.png";
import SoundIconDisabled from "../../../../assets/icons/sound-disabled.png";
import Range from "../../../ui/Range";
import { useSound } from "../../../../hooks/sound";
import Colors from "./Colors";
import { useTranslation } from "react-i18next";
import "./style.scss";

const Preferences: FC = () => {
  const { t } = useTranslation();
  const { config, setConfig } = configStore((state) => state);
  const { play } = useSound();
  const soundIcons = {
    on: SoundIcon,
    off: SoundIconDisabled,
  };

  const toggleSound = () => {
    setConfig({ ...config, disabledSound: !config.disabledSound });
  };

  const handleRangeChange = (values: number[]) => {
    setConfig({ ...config, volume: values[0] });
    play("click");
  };

  return (
    <div className="preferences-container">
      <Typography style={{ alignSelf: "center" }} variant="sub-header-main">
        {t("preferences")}
      </Typography>

      <div className="preferences-content">
        <div className="sound-item-container">
          <Typography variant="sub-header-main">{t("sound")}:</Typography>
          <img onClick={toggleSound} src={soundIcons[config.disabledSound ? "off" : "on"]} />
        </div>
        <div className="sound-item-container">
          <Typography className="volume-label" variant="sub-header-main">
            {t("volume")}:
          </Typography>
          <Range values={[config.volume]} min={1} max={10} step={1} onChange={handleRangeChange} />
        </div>
        <Colors />
      </div>
    </div>
  );
};

export default Preferences;
