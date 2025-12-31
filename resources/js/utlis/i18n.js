import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const allModules = import.meta.glob('@/locales/**/*.json', { eager: true });
const resources = {};

for (const path in allModules) {
  const match = path.match(/\/locales\/([^/]+)\/([^/]+)\.json$/);
  if (!match) continue;

  const lng = match[1];
  const ns = match[2]; 

  if (!resources[lng]) resources[lng] = {};
  resources[lng][ns] = allModules[path];
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'id',
    interpolation: { escapeValue: false },
    defaultNS: 'common',
  });

export default i18n;
