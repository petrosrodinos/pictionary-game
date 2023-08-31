import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import English from "../../src/assets/locales/en/translation.json";
import Greek from "../../src/assets/locales/gr/translation.json";

const resources = {
  en: {
    translation: English,
  },
  gr: {
    translation: Greek,
  },
};

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    supportedLngs: ["en", "gr"],
    fallbackLng: "en",
    resources,
    detection: {
      order: ["localStorage", "cookie"],
      caches: ["localStorage"],
    },
  });

export default i18n;
