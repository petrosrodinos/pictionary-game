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
  const getRandom5Words = () => {
    const words = WORDS[category];
    const randomWords = [];
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * words.length);
      randomWords.push(words[randomIndex]);
    }
    return randomWords;
  };

  return (
    <div className="choosing-word-container">
      <Typography variant="sub-header-main" className="choosing-word-label">
        You are choosing a word!
      </Typography>
      <Loader time={time} />
      <Typography variant="text-accent" className="words-label">
        WORDS
      </Typography>
      <ChipSelector chips={getRandom5Words()} onChange={onWordSelected} />
      <Players players={players} />
    </div>
  );
};

export default ChoosingWord;
