'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { type Locale, type Dictionary, dictionaries, getDefaultLocale } from '@/lib/i18n';

type LocaleContextType = {
  locale: Locale;
  t: Dictionary;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextType | null>(null);

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  const saved = localStorage.getItem('locale') as Locale | null;
  return saved ?? getDefaultLocale();
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
    document.documentElement.lang = newLocale;
  }, []);

  if (!mounted) {
    return (
      <LocaleContext value={{ locale: 'en', t: dictionaries.en, setLocale }}>
        {children}
      </LocaleContext>
    );
  }

  return (
    <LocaleContext value={{ locale, t: dictionaries[locale], setLocale }}>
      {children}
    </LocaleContext>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useLocale must be used within LocaleProvider');
  return context;
}
