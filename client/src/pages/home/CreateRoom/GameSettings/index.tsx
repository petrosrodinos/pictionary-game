import { FC, useState, useMemo } from "react";
import Input from "../../../../components/ui/Input";
import Typography from "../../../../components/ui/Typography";
import {
  CATEGORIES,
  DifficaltyLevels,
  MAX_CHOOSING_WORD_TIME_IN_SECONDS,
  MAX_PLAYERS_IN_ROOM,
  MAX_ROUND_TIME_IN_SECONDS,
  MIN_CHOOSING_WORD_TIME_IN_SECONDS,
  MIN_PLAYERS_IN_ROOM,
  MIN_ROUND_TIME_IN_SECONDS,
} from "../../../../constants/game";
import ChipSelector from "../../../../components/ui/ChipSelector";
import { GameSettings as GameSettingsInt } from "../../../../interfaces/typing";
import { useTranslation } from "react-i18next";
import CreateCategory from "./CreateCategory";
import { authStore } from "../../../../store/authStore";
import "./style.scss";

interface GameSettingsProps {
  settings: GameSettingsInt;
  onChange: (setting: { name: string; value: string | number }) => void;
}

const GameSettings: FC<GameSettingsProps> = ({ onChange, settings }) => {
  const { role } = authStore((state) => state);
  const [categories, setCategories] = useState<string[]>(CATEGORIES);
  const { t } = useTranslation();

  const createCategoryRoles = ["parent", "teacher"];

  const handleChange = (e: any) => {
    onChange({ name: e.target.name, value: e.target.value });
  };

  const handleChipChanged = (data: { name: string; value: string }) => {
    onChange({
      name: data.name,
      value: data.value,
    });
  };

  const handleCreateCategory = (category: string) => {
    setCategories((prev) => [...prev, category]);
    // onChange({
    //   name: "category",
    //   value: category,
    // });
  };

  const handleCancelCreateCategory = () => {
    setCategories((prev) => prev.slice(0, prev.length - 1));
  };

  const selectedCategory = useMemo(() => {
    if (categories.length <= CATEGORIES.length) {
      return categories[0];
    }
    return categories[categories.length - 1];
  }, [categories]);

  return (
    <div className="settings-container">
      <Typography variant="header-main" className="settings-label">
        {t("settings")}
      </Typography>
      <Typography variant="text-main" className="category-label">
        {t("word-category")}
      </Typography>
      <ChipSelector
        disabled={categories.length > CATEGORIES.length}
        value={selectedCategory}
        name="category"
        chips={categories}
        onChange={handleChipChanged}
      />
      {createCategoryRoles.includes(role) && (
        <CreateCategory
          onCancel={handleCancelCreateCategory}
          onCreateCategory={handleCreateCategory}
        />
      )}
      <Typography variant="text-main" className="category-label">
        {t("difficalty-label")}
      </Typography>
      <ChipSelector
        defaultValue
        name="difficalty"
        chips={DifficaltyLevels}
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
