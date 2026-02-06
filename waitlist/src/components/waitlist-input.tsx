'use client';

import { Input } from './ui/input';
import { Button } from './ui/button';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Spinner } from "@/components/ui/spinner"
import { CheckIcon } from 'lucide-react';
import { sendWaitlistSignupMessage } from '@/lib/slack';

export function WaitlistInput() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isloading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    

    const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setIsLoading(true);
        if (!email) {
            setError('Email is required');
        } else if (!checkValidEmail(email)) {
            setError('Invalid email address');
        } else {
            setError('');
            const supabase = await createClient();
            const { data, error } = await supabase.from('waitlist').insert({ email });
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
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button type="submit" variant="outline" onClick={handleSubmit}>
          {isloading ? <Spinner /> : success ? <>
            
            <span className="text-green-700 flex items-center gap-2">
            <CheckIcon className="size-4" />
                Joined!</span>
          </>
              : 'Join Waitlist'}
        </Button>
      </div>
        <p className="text-sm text-zinc-500">we&apos;ll send you an email when we&apos;re ready to launch</p>
        {error && <p className="text-red-500">{error}</p>}
    </>
  );
}
