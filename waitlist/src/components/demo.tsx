'use client';

import { Iphone } from '@/components/ui/iphone';
import { useLocale } from './locale-provider';

export function Demo() {
  const { t } = useLocale();

  return (
    <div className="max-w-[500px] w-full flex relative font-caveat text-3xl">
      <div className="absolute -rotate-5 w-full h-full gap-4 flex flex-col pl-4 md:pl-0 md:left-20 ">
        <p>{t.demo.longForm}</p>
        <Iphone src="/demo-long.png" className="max-w-1/2" />
      </div>
      <div className="flex pt-20 w-full items-end justify-end flex-col align-end rotate-10 z-10 ">
        <Iphone src="/demo-short.png" className="max-w-1/2 self-end md:mr-0 mr-10" />
        <p>{t.demo.shortForm}</p>
      </div>
    </div>
  );
}
