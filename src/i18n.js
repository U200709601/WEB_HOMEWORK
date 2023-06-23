import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
// ----------------------------------------------------------------------
import TRANSLATIONS_EN from "src/translations/en/translation.json";
import TRANSLATIONS_DE from "src/translations/de/translation.json";
import TRANSLATIONS_FR from "src/translations/fr/translation.json";
import TRANSLATIONS_IT from "src/translations/it/translation.json";
// ----------------------------------------------------------------------

const resources = {
    "en-US": { translation: TRANSLATIONS_EN },
    "de-DE": { translation: TRANSLATIONS_DE },
    "fr-FR": { translation: TRANSLATIONS_FR },
    "it-IT": { translation: TRANSLATIONS_IT },
};

i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
        resources,
        lng: "en-US",
        fallbackLng: "en-US",
    });

export default i18n;
