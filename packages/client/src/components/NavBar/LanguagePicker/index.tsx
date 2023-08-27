import { FC, useState, useEffect, useRef } from "react";
import { MdLanguage } from "react-icons/md";
import { useTranslation } from "react-i18next";
import Typography from "../../ui/Typography";
import GreekFlag from "../../../assets/flags/greek.png";
import EnglishFlag from "../../../assets/flags/english.png";
import { useSound } from "../../../hooks/sound";
import "./style.scss";

const LanguagePicker: FC = () => {
  const { play } = useSound();
  const languagePickerRef = useRef<any>(null);
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState<string>(i18n.language);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    setLanguage(i18n.language);
  }, [i18n.language]);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (languagePickerRef.current && !languagePickerRef?.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleLanguagePicker = () => {
    play("click");
    setOpen(!open);
  };

  const selectLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setLanguage(code);
    setOpen(false);
  };

  const languages = [
    {
      name: "English",
      code: "en",
      flag: EnglishFlag,
    },
    {
      name: "Ελληνικά",
      code: "gr",
      flag: GreekFlag,
    },
  ];

  return (
    <div
      ref={languagePickerRef}
      onClick={toggleLanguagePicker}
      className="nav-bar-icon language-picker-container"
    >
      <MdLanguage />
      {open && (
        <div className="language-picker">
          {languages.map((lang, index) => (
            <div
              key={index}
              onClick={() => selectLanguage(lang.code)}
              className="language-picker-item"
            >
              <div
                className={`language-container ${language == lang.code ? "selected-language" : ""}`}
              >
                <img src={lang.flag} />
                <Typography>{lang.name}</Typography>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguagePicker;
