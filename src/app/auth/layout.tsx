'use client';

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import type {PropsWithChildren} from 'react';

const authQueryClient = new QueryClient();

export default function AuthLayout({children}: PropsWithChildren) {
  return (
    <QueryClientProvider client={authQueryClient}>
      {children}
    </QueryClientProvider>
  );
}
