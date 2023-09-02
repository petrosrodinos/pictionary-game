import { FC } from "react";
import Input from "../../../../components/ui/Input";
import Typography from "../../../../components/ui/Typography";
import {
  Difficalty,
  MAX_CHOOSING_WORD_TIME_IN_SECONDS,
  MAX_PLAYERS_IN_ROOM,
  MAX_ROUND_TIME_IN_SECONDS,
  MIN_CHOOSING_WORD_TIME_IN_SECONDS,
  MIN_PLAYERS_IN_ROOM,
  MIN_ROUND_TIME_IN_SECONDS,
  WORD_LIST,
} from "../../../../constants/game";
import ChipSelector from "../../../../components/ui/ChipSelector";
import { GameSettings as GameSettingsInt } from "../../../../interfaces/typing";
import { useTranslation } from "react-i18next";
import "./style.scss";

interface GameSettingsProps {
  settings: GameSettingsInt;
  onChange: (setting: { name: string; value: string | number }) => void;
}

const GameSettings: FC<GameSettingsProps> = ({ onChange, settings }) => {
  const { t } = useTranslation();
  const handleChange = (e: any) => {
    onChange({ name: e.target.name, value: e.target.value });
  };

  const handleChipChanged = (data: { name: string; value: string }) => {
    onChange({
      name: data.name,
      value: data.value,
    });
  };

  return (
    <div className="settings-container">
      <Typography variant="header-main" className="settings-label">
        {t("settings")}
      </Typography>
      <Typography variant="text-main" className="category-label">
        {t("word-category")}
      </Typography>
      <ChipSelector
        defaultValue
        name="category"
        chips={Object.keys(WORD_LIST)}
        onChange={handleChipChanged}
      />
      <Typography variant="text-main" className="category-label">
        {t("difficalty-label")}
      </Typography>
      <ChipSelector
        defaultValue
        name="difficalty"
        chips={Object.values(Difficalty)}
        onChange={handleChipChanged}
      />

      <Input
        label={t("max-players")}
        type="number"
        name="maxPlayers"
        placeholder={t("players")}
        onChange={handleChange}
        value={settings.maxPlayers}
        min={MIN_PLAYERS_IN_ROOM}
        max={MAX_PLAYERS_IN_ROOM}
      />
      <Input
        label={t("round-time")}
        type="number"
        name="roundTime"
        placeholder={t("round-time")}
        onChange={handleChange}
        value={settings.roundTime}
        max={MAX_ROUND_TIME_IN_SECONDS}
        min={MIN_ROUND_TIME_IN_SECONDS}
      />
      <Input
        label={t("choosing-word-time")}
        type="number"
        name="choosingWordTime"
        placeholder={t("choosing-word-time")}
        onChange={handleChange}
        value={settings.choosingWordTime}
        max={MAX_CHOOSING_WORD_TIME_IN_SECONDS}
        min={MIN_CHOOSING_WORD_TIME_IN_SECONDS}
      />
    </div>
  );
};

export default GameSettings;
