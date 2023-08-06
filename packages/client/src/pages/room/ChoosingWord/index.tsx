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
  message?: string | null;
}

const ChoosingWord: FC<ChoosingWordProps> = ({
  time,
  players,
  category,
  message,
  onWordSelected,
}) => {
  const getRandom5Words = () => {
    const words = WORDS[category];
    const randomWords: string[] = [];
    while (randomWords.length < 5) {
      const randomIndex = Math.floor(Math.random() * words.length);
      if (randomWords.includes(words[randomIndex])) continue;
      randomWords.push(words[randomIndex]);
    }

    return randomWords;
  };

  return (
    <div className="choosing-word-container">
      {message && (
        <>
          <Typography className="artist-label" variant="text-accent">
            {message}
          </Typography>
        </>
      )}
      <Typography variant="sub-header-main" className="choosing-word-label">
        You are choosing a word!
      </Typography>
      <Loader time={time} />
      <Typography variant="text-accent" className="words-label">
        WORDS
      </Typography>
      <ChipSelector
        style={{ alignSelf: "center" }}
        chips={getRandom5Words()}
        onChange={onWordSelected}
      />
      <Players players={players} />
    </div>
  );
};

export default ChoosingWord;
