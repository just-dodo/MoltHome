'use client';

import Image from 'next/image';
import { WaitlistInput } from '@/components/waitlist-input';
import { DotPattern } from '@/components/ui/dot-pattern';
import { cn } from '@/lib/utils';
import { Demo } from '@/components/demo';
import { useLocale } from '@/components/locale-provider';
import { LocaleToggle } from '@/components/locale-toggle';

export default function Home() {
  const { t } = useLocale();

  return (
    <div className="flex min-h-screen items-center justify-center bg-whitefont-sans dark:bg-black">
      <main className="flex w-full relative max-w-7xl flex-col md:flex-row  justify-center py-16 px-4 md:px-16  dark:bg-black items-center gap-10 md:gap-0 ">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <div className="flex flex-row items-center gap-2 justify-between w-full">
            <div className="flex flex-row items-center gap-2">
              <Image src="/logo.png" alt="ShortGuard" width={50} height={50} className="rounded-md" />
              <h1 className="text-4xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
                MoltHome
              </h1>
            </div>
            <LocaleToggle />
          </div>
          <h1 className="text-5xl font-semibold leading-16 tracking-tight text-black dark:text-zinc-50">
            {t.hero.headingBefore}<s>
              <span className="text-black/50">{t.hero.headingPrice}</span>
              </s>
              {t.hero.headingAfter}
            <br />
            {t.hero.headingLine2}
          </h1>
          <p className="text-lg  text-zinc-600 dark:text-zinc-400">
            {t.hero.subtitle1}
            <br />
            {t.hero.subtitle2}
          </p>
          <WaitlistInput />

          <DotPattern
        className={cn(
          "[mask-image:radial-gradient(1000px_circle_at_left,white,transparent,transparent)] -z-10 "
        )}
      />
        </div>
        {/* <Demo /> */}
      </main>
    </div>
  );
}
