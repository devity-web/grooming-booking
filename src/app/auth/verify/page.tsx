'use client';

import {IconLoader} from '@tabler/icons-react';
import {useRouter, useSearchParams} from 'next/navigation';
import {useEffect} from 'react';
import {toast} from 'sonner';
import {createClient} from '@/lib/supabase/client';

export default function CodePage() {
  const params = useSearchParams();
  const client = createClient();
  const router = useRouter();

  // biome-ignore lint/correctness/useExhaustiveDependencies: just watch for params
  useEffect(() => {
    const code = params.get('code');

    if (code) {
      client.auth
        .exchangeCodeForSession(code)
        .then(response => {
          if (response.error) {
            throw response.error;
          }

          router.push('/dashboard');
        })
        .catch(error => {
          toast.error(error.message);
        });
    }
  }, [params]);

  return (
    <div className="flex items-center gap-4 justify-center">
      <IconLoader
        data-slot="spinner"
        role="status"
        aria-label="Loading"
        className="size-6 animate-spin"
      />
      <p>Verificando sua conta...</p>
    </div>
  );
}
