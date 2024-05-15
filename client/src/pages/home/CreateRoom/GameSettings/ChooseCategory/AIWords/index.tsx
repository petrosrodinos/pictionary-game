import { FC } from "react";
import { useMutation } from "react-query";
import { getWords } from "../../../../../../services/openapi";
import AIIcon from "../../../../../../assets/icons/chip.png";
import Spinner from "../../../../../../components/ui/Spinner";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { DifficaltyLevels, WORDS_TO_GENERATE } from "../../../../../../constants/game";
import { Tooltip } from "react-tooltip";
import "./style.scss";

interface AIWordsProps {
  category: string;
  onWordsGenerated: (data: any) => void;
  className?: string;
  style?: React.CSSProperties;
}

const AIWords: FC<AIWordsProps> = ({ onWordsGenerated, category, className = "", style }) => {
  const { t } = useTranslation();
  const { mutate: generateWords, isLoading } = useMutation((data: any) => {
    return getWords(data);
  });

  const handleGenerateWords = () => {
    if (isLoading) return;
    generateWords(
      {
        category,
        difficaltyLevels: DifficaltyLevels.join(","),
        numberOfWords: WORDS_TO_GENERATE,
      },
      {
        onSuccess: (data) => {
          onWordsGenerated(JSON.parse(data.result));
        },
        onError: () => {
          toast.error(t("could-not-generate-words"));
        },
      }
    );
  };

  return (
    <div className="ai-words">
      <Spinner color="white" variant="secondary" size={30} loading={isLoading} />

      {!isLoading && (
        <>
          <div
            data-tooltip-id="ai-tooltip"
            onClick={handleGenerateWords}
            className={`ai-words-container ${className}`}
            style={style}
          >
            <div className="ai-words-content">
              {!isLoading && <img className="ai-icon" src={AIIcon} alt="ai-icon" />}
            </div>
          </div>
          <Tooltip
            style={{ zIndex: "10", fontFamily: "Averia Libre" }}
            id="ai-tooltip"
            place="bottom"
            content={t("generate-words")}
          />
        </>
      )}
    </div>
  );
};

export default AIWords;
