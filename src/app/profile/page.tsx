import TestComponentFirst from '@/components/test-component-first';
import TestComponentSecond from '@/components/test-component-second';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default function Profile() {
  return (
    <main className=" flex flex-col gap-2 ">
      <Suspense fallback={<h2>Loading...</h2>}>
        <TestComponentFirst />
      </Suspense>
      <Suspense fallback={<h2>Loading...</h2>}>
        <TestComponentSecond />
      </Suspense>
    </main>
  );
}
