import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    supportedLngs: ["en", "gr"],
    fallbackLng: "en",
    detection: {
      order: ["localStorage", "cookie"],
      caches: ["localStorage"],
    },
    backend: {
      loadPath: "../../public/locales/{{lng}}/translation.json",
    },
  });

export default i18n;
