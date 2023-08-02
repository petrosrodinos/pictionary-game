import { FC } from "react";
import Typography from "../../../components/ui/Typography";
import Loader from "../../../components/ui/Loader";
import Players from "../WaitingWord/Players";
import { WORDS } from "../../../constants/game";
import ChipSelector from "../../../components/ui/ChipSelector";
import "./style.scss";

interface ChoosingWordProps {
  time: number;
  players: UserType[];
  category: keyof typeof WORDS;
  onWordSelected: (word: string) => void;
}

const ChoosingWord: FC<ChoosingWordProps> = ({ time, players, category, onWordSelected }) => {
  return (
    <div className="choosing-word-container">
      <Typography variant="sub-header-main" className="choosing-word-label">
        You are choosing a word!
      </Typography>
      <Loader time={time} />
      <Typography variant="text-accent" className="words-label">
        WORDS
      </Typography>
      <ChipSelector chips={WORDS[category]} onChange={onWordSelected} />
      <Players players={players} />
    </div>
  );
};

export default ChoosingWord;
