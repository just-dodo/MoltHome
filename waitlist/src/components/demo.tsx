import { Iphone } from '@/components/ui/iphone';

export function Demo() {
  return (
    <div className="max-w-[500px] w-full flex relative font-caveat text-3xl">
      <div className="absolute -rotate-5 w-full h-full gap-4 flex flex-col pl-4 md:pl-0 md:left-20 ">
        <p>While long-form videos work well,</p>
        <Iphone src="/demo-long.png" className="max-w-1/2" />
      </div>
      <div className="flex pt-20 w-full items-end justify-end flex-col align-end rotate-10 z-10 ">
        <Iphone src="/demo-short.png" className="max-w-1/2 self-end md:mr-0 mr-10" />
        <p>Short-form videos are blocked!</p>
      </div>
    </div>
  );
}
