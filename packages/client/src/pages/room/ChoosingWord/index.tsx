import { FC } from "react";
import Typography from "../../../components/ui/Typography";
import Loader from "../../../components/ui/Loader";
import Players from "../WaitingWord/Players";
import { WORDS } from "../../../constants/game";
import "./style.scss";

interface ChoosingWordProps {
  time: number;
  players: UserType[];
  onWordSelected: (word: string) => void;
  onTimerFinish: () => void;
}

const ChoosingWord: FC<ChoosingWordProps> = ({ time, players, onTimerFinish, onWordSelected }) => {
  return (
    <div className="choosing-word-container">
      <Typography variant="sub-header-main" className="choosing-word-label">
        You are choosing a word!
      </Typography>
      <Loader onFinish={onTimerFinish} time={time} />
      <Typography variant="text-accent" className="words-label">
        WORDS
      </Typography>
      <div className="words-container">
        {WORDS["animals"].map((word, index) => (
          <div key={index} className="word-item" onClick={() => onWordSelected(word)}>
            <Typography>{word}</Typography>
          </div>
        ))}
      </div>
      <Players players={players} />
    </div>
  );
};

export default ChoosingWord;
