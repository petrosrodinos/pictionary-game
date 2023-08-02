import { FC } from "react";
import Input from "../../../../components/ui/Input";
import Typography from "../../../../components/ui/Typography";
import { MAX_PLAYERS_IN_ROOM, MIN_PLAYERS_IN_ROOM, WORDS } from "../../../../constants/game";
import ChipSelector from "../../../../components/ui/ChipSelector";
import "./style.scss";

interface GameSettingsProps {
  settings: any;
  onChange: (setting: { name: string; value: string | number }) => void;
}

const GameSettings: FC<GameSettingsProps> = ({ onChange, settings }) => {
  const handleChange = (e: any) => {
    onChange({ name: e.target.name, value: parseInt(e.target.value) });
  };

  const handleCategorySelected = (category: string) => {
    onChange({
      name: "category",
      value: category,
    });
  };

  return (
    <div className="settings-container">
      <Typography variant="header-main" className="settings-label">
        Settings
      </Typography>
      <Typography variant="text-main" className="category-label">
        Word Category
      </Typography>
      <ChipSelector chips={Object.keys(WORDS)} onChange={handleCategorySelected} />
      <Input
        label="Max Players"
        type="number"
        name="maxPlayers"
        placeholder="Players"
        onChange={handleChange}
        value={settings.maxPlayers}
        min={MIN_PLAYERS_IN_ROOM}
        max={MAX_PLAYERS_IN_ROOM}
      />
      <Input
        label="Round Time (m)"
        type="number"
        name="roundTime"
        placeholder="Round Time (m)"
        onChange={handleChange}
        value={settings.roundTime}
        max={5}
        min={1}
      />
      <Input
        label="Choosing Word Time (m)"
        type="number"
        name="choosingWordTime"
        placeholder="Choosing Word Time (m)"
        onChange={handleChange}
        value={settings.choosingWordTime}
        max={5}
        min={1}
      />
    </div>
  );
};

export default GameSettings;
