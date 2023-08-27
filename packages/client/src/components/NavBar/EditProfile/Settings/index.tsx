import { FC } from "react";
import { configStore } from "../../../../store/config";
import Typography from "../../../ui/Typography";
import SoundIcon from "../../../../assets/icons/sound.png";
import SoundIconDisabled from "../../../../assets/icons/sound-disabled.png";
import Range from "../../../ui/Range";
import { useSound } from "../../../../hooks/sound";
import "./style.scss";

const Preferences: FC = () => {
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
    <div className="settings-container">
      <Typography variant="sub-header-main">Preferences</Typography>

      <div className="settings-content">
        <div className="preference-container">
          <Typography className="sound-label" variant="sub-header-main">
            Sound:
          </Typography>
          <img onClick={toggleSound} src={soundIcons[config.disabledSound ? "off" : "on"]} />
        </div>
        <div className="preference-container">
          <Typography className="volume-label" variant="sub-header-main">
            Volume:
          </Typography>
          <Range values={[5]} min={1} max={10} step={1} onChange={handleRangeChange} />
        </div>
      </div>
    </div>
  );
};

export default Preferences;
