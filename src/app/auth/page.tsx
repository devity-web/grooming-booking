import {Suspense} from 'react';
import {LoginForm} from '@/components/auth/login-form';
import {Spinner} from '@/components/ui/spinner';

export default function LoginPage() {
  return (
    <Suspense fallback={<Spinner className="size-8" />}>
      <LoginForm />
    </Suspense>
  );
}
