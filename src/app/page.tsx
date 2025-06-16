import TestComponentClient from '@/features/home/components/test-component-client';
import TestComponentSecond from '@/features/home/components/test-component-server';

import { Suspense } from 'react';

export default function Home() {
  return (
    <main className=" flex flex-col gap-2 ">
      <Suspense fallback={<h2>Loading...</h2>}>
        <TestComponentSecond />
      </Suspense>
      <TestComponentClient />
    </main>
  );
}
