import { FC } from "react";
import Typography from "../../../components/ui/Typography";
import Loader from "../../../components/ui/Loader";
import "./style.scss";

interface ChoosingWordProps {
  time: number;
  words: string[];
  onWordSelected: (word: string) => void;
  onTimerFinish: () => void;
}

const ChoosingWord: FC<ChoosingWordProps> = ({ time, onTimerFinish, onWordSelected, words }) => {
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
        {words.map((word, index) => (
          <div key={index} className="word-item" onClick={() => onWordSelected(word)}>
            <Typography>{word}</Typography>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChoosingWord;
