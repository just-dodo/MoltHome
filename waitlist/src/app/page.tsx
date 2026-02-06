import Image from 'next/image';
import { WaitlistInput } from '@/components/waitlist-input';
import { DotPattern } from '@/components/ui/dot-pattern';
import { cn } from '@/lib/utils';
import { Demo } from '@/components/demo';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-whitefont-sans dark:bg-black">
      <main className="flex w-full relative max-w-7xl flex-col md:flex-row  justify-center py-16 px-4 md:px-16  dark:bg-black items-center gap-10 md:gap-0 ">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <div className="flex flex-row items-center gap-2">
            <Image src="/logo.png" alt="ShortGuard" width={50} height={50} />
            <h1 className="text-4xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
              ShortGuard
            </h1>
          </div>
          <h1 className="text-5xl font-semibold leading-16 tracking-tight text-black dark:text-zinc-50">
            Your enemy is not YouTube,
            <br />
            it&apos;s Shorts.
          </h1>
          <p className="text-lg  text-zinc-600 dark:text-zinc-400">
            Block short-form videos on your iPhone.
            <br />
            Works on YouTube & Instagram.
          </p>
          <WaitlistInput />

          <DotPattern
        className={cn(
          "[mask-image:radial-gradient(1000px_circle_at_left,white,transparent,transparent)] -z-10 "
        )}
      />
        </div>
        <Demo />
      </main>
    </div>
  );
}
