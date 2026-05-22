import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context) {
    return {
      language: context.language,
      t: context.t
    };
  }
  const stored = localStorage.getItem('billkaro_language') || 'English';
  return {
    language: stored as 'Hindi' | 'English' | 'Hinglish',
    t: (key: string) => key
  };
};

export const useGlobalDOMTranslator = () => {};

export default useTranslation;