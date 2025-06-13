import TestComponentSecond from '@/feature/home/components/test-component-second';
import TestComponentThird from '@/feature/home/components/test-component-third';
import { Suspense } from 'react';

export default function Home() {
  return (
    <main className=" flex flex-col gap-2 ">
      <Suspense fallback={<h2>Loading...</h2>}>
        <TestComponentSecond />
      </Suspense>
      <TestComponentThird />
    </main>
  );
}
