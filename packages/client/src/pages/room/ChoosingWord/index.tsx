import { FC } from "react";
import Typography from "../../../components/ui/Typography";
import Loader from "../../../components/ui/Loader";
import Players from "../WaitingWord/Players";
import { WORDS, SELECTABLE_WORDS_LIST_LENGTH } from "../../../constants/game";
import ChipSelector from "../../../components/ui/ChipSelector";
import { UserType } from "../../../interfaces/typing";
import "./style.scss";

interface ChoosingWordProps {
  time: number;
  players: UserType[];
  category: string;
  difficalty: string;
  onWordSelected: (word: string) => void;
  message?: string | null;
}

const ChoosingWord: FC<ChoosingWordProps> = ({
  time,
  players,
  category,
  difficalty,
  message,
  onWordSelected,
}) => {
  const getRandomWords = (length: number = SELECTABLE_WORDS_LIST_LENGTH) => {
    const words = WORDS[category][difficalty];
    const randomWords: string[] = [];
    while (randomWords.length < length) {
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
        chips={getRandomWords()}
        name="word"
        onChange={(e: any) => onWordSelected(e.value)}
      />
      <Players players={players} />
    </div>
  );
};

export default ChoosingWord;
