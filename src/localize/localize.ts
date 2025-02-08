import * as en from './languages/en.json';
import * as ca from './languages/ca.json';
import * as es from './languages/es.json';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const languages: any = {
  ca: ca,
  en: en,
  es: es,
};

export function localize(string: string, search = '', replace = ''): string {
  const lang = (localStorage.getItem('selectedLanguage') || 'en').replace(/['"]+/g, '').replace('-', '_');
  let translated: string;

  try {
    translated = string.split('.').reduce((o, i) => o[i], languages[lang]);
  } catch (e) {
    translated = string.split('.').reduce((o, i) => o[i], languages['en']);
  }

  if (translated === undefined) translated = string.split('.').reduce((o, i) => o[i], languages['en']);

  if (search !== '' && replace !== '') {
    translated = translated.replace(search, replace);
  }
  return translated;
}
