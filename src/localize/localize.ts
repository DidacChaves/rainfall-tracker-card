import * as en from './languages/en.json';
import * as ca from './languages/ca.json';
import * as es from './languages/es.json';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const languages: Record<string, any> = {
  ca,
  en,
  es,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const lookup = (dictionary: any, key: string): string | undefined => {
  const value = key.split('.').reduce((o, i) => (o == null ? undefined : o[i]), dictionary);
  return typeof value === 'string' ? value : undefined;
};

/**
 * Translates a key such as `ERROR.NO_ENTITY`.
 * @param key Dot separated key (upper case, as in the language files)
 * @param language Language code, normally `hass.language` (`es`, `ca`, `es-ES`...)
 * @param params Values for `{placeholders}` in the text
 *
 * Falls back to the base language (`es-ES` -> `es`), then English, then the key itself.
 */
export function localize(key: string, language = 'en', params: Record<string, string> = {}): string {
  const lang = language.replace(/['"]+/g, '').replace('_', '-').toLowerCase();
  const dictionary = languages[lang] ?? languages[lang.split('-')[0]] ?? languages.en;
  const text = lookup(dictionary, key) ?? lookup(languages.en, key) ?? key;

  return Object.entries(params).reduce((result, [name, value]) => result.split(`{${name}}`).join(value), text);
}
