import TestComponentFirst from '@/feature/category/components/test-component-first';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default function Category() {
  return (
    <main className=" flex flex-col gap-2 ">
      <Suspense fallback={<h2>Loading...</h2>}>
        <TestComponentFirst />
      </Suspense>
    </main>
  );
}
