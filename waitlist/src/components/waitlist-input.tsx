'use client';

import { Input } from './ui/input';
import { Button } from './ui/button';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Spinner } from "@/components/ui/spinner"
import { CheckIcon } from 'lucide-react';
import { sendWaitlistSignupMessage } from '@/lib/slack';
import { useLocale } from './locale-provider';

export function WaitlistInput() {
    const { locale, t } = useLocale();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isloading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);



    const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setIsLoading(true);
        if (!email) {
            setError(t.waitlist.errorRequired);
        } else if (!checkValidEmail(email)) {
            setError(t.waitlist.errorInvalid);
        } else {
            setError('');
            const supabase = await createClient();
            const { data, error } = await supabase.from('waitlist').insert({ email, locale });
            if (error) {
                setError(error.message);
            } else {
              sendWaitlistSignupMessage(email);
                setError('');
                setSuccess(true);
            }
        }
        setIsLoading(false);
    };

    const checkValidEmail = (email: string) => {
        return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    };


  return (
    <>
      <div className="flex w-full max-w-sm items-center gap-2">
        <Input type="email" placeholder={t.waitlist.placeholder} value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button type="submit" variant="outline" onClick={handleSubmit}>
          {isloading ? <Spinner /> : success ? <>

            <span className="text-green-700 flex items-center gap-2">
            <CheckIcon className="size-4" />
                {t.waitlist.joined}</span>
          </>
              : t.waitlist.submit}
        </Button>
      </div>
        <p className="text-sm text-zinc-500">{t.waitlist.hint}</p>
        {error && <p className="text-red-500">{error}</p>}
    </>
  );
}
