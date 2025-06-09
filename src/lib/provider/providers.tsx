'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useState } from 'react';
import Toast from './toast/Toast';

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false, // default: true,чтобы не было повторных запросов при изменении фокуса
          },
        },
      })
  );
  return (
    <QueryClientProvider client={queryClient}>
      <Toast />
      {children}
    </QueryClientProvider>
  );
};

export default Providers;
