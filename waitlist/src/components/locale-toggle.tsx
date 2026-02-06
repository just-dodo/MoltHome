'use client';

import { useLocale } from './locale-provider';

export function LocaleToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <button
      onClick={() => setLocale(locale === 'en' ? 'ko' : 'en')}
      className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
      aria-label="Toggle language"
    >
      {locale === 'en' ? '한국어' : 'English'}
    </button>
  );
}
