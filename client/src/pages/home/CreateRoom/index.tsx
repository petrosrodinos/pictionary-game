import { FC, useState } from "react";
import Typography from "../../../components/ui/Typography";
import Button from "../../../components/ui/Button";
import { CLIENT_URL } from "../../../constants";
import {
  CATEGORIES,
  CHOOSING_WORD_TIME_IN_SECONDS,
  Difficalty,
  PLAYERS_IN_ROOM,
  ROUND_TIME_IN_SECONDS,
} from "../../../constants/game";
import { createRoomCode } from "../../../utils/code";
import { transformToMilliseconds } from "../../../utils/time";
import { GameSettings as GameSettingsInt } from "../../../interfaces/typing";
import GameSettings from "./GameSettings";
import Copable from "../../../components/ui/Copable";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Toast from "../../../components/ui/Toast";
import { authStore } from "../../../store/authStore";
import "./style.scss";
import { ChipValue } from "../../../components/ui/ChipSelector";

interface CreateRoomProps {
  onCancel: () => void;
  onCreate: (name: GameSettingsInt) => void;
}

const CreateRoom: FC<CreateRoomProps> = ({ onCancel, onCreate }) => {
  const { t, i18n } = useTranslation();
  const { words, categories } = authStore();
  const [settings, setSettings] = useState<GameSettingsInt>({
    maxPlayers: PLAYERS_IN_ROOM,
    roundTime: ROUND_TIME_IN_SECONDS,
    choosingWordTime: CHOOSING_WORD_TIME_IN_SECONDS,
    category: CATEGORIES[0],
    difficalty: Difficalty.EASY,
    code: createRoomCode(),
    language: i18n.language,
    customWords: [],
  });

  const handleSettingsChanged = ({ name, value }: { name: string; value: string | number }) => {
    setSettings({
      ...settings,
      [name]: value,
    });
  };

  const handleCreateRoom = () => {
    if (!settings.choosingWordTime || !settings.roundTime || !settings.maxPlayers)
      return toast.warn(t("fill-out-all-fields"));

    let gameSettings = {
      ...settings,
      maxPlayers: Number(settings.maxPlayers),
      choosingWordTime: transformToMilliseconds(settings.choosingWordTime),
      roundTime: transformToMilliseconds(settings.roundTime),
    };
    if (categories.find((category: ChipValue) => settings.category === category.value)) {
      gameSettings.customWords = JSON.parse(words)[settings.category][settings.difficalty];
    }
    onCreate(gameSettings);
  };

  return (
    <div className="create-room-container">
      <Toast />
      <Typography variant="text-accent" className="text-primary-label">
        {t("play-with-friends")}
      </Typography>
      <Typography variant="small-text-main" className="text-secondary-label">
        <Copable value={settings.code}>{settings.code}</Copable>
      </Typography>
      <Typography variant="text-accent" className="text-primary-label">
        {t("or-the-link")}
      </Typography>
      <Typography variant="small-text-main" className="text-secondary-label">
        <Copable value={`${CLIENT_URL}home?room=${settings.code}`}>
          {CLIENT_URL}home?room={settings.code}
        </Copable>
      </Typography>
      <GameSettings settings={settings} onChange={handleSettingsChanged} />
      <div className="buttons-container">
        <Button onClick={handleCreateRoom} title={t("create")} />
        <Button onClick={onCancel} variant="secondary" title={t("cancel")} />
      </div>
    </div>
  );
};

export default CreateRoom;
