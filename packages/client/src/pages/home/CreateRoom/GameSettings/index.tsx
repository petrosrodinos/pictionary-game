import { FC } from "react";
import Input from "../../../../components/ui/Input";
import Typography from "../../../../components/ui/Typography";
import { MAX_PLAYERS, ROUNDS } from "../../../../constants/game";
import "./style.scss";

interface GameSettingsProps {
  onChange: (setting: { name: string; value: number }) => void;
}

const GameSettings: FC<GameSettingsProps> = ({ onChange }) => {
  const handleChange = (e: any) => {
    onChange({ name: e.target.name, value: parseInt(e.target.value) });
  };
  return (
    <div className="settings-container">
      <Typography variant="header-main" className="settings-label">
        Settings
      </Typography>
      <Input
        type="number"
        name="players"
        placeholder={`Players (default:${MAX_PLAYERS})`}
        onChange={handleChange}
      />
      <Input
        type="number"
        name="rounds"
        placeholder={`Rounds (default:${ROUNDS})`}
        onChange={handleChange}
      />
    </div>
  );
};

export default GameSettings;
