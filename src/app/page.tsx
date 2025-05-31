import { Suspense } from 'react';
import TestComponent from './components/test-component';

export default function Home() {
  return (
    <main className=" flex flex-col py-[200px] items-center">
      <h1 className=" text-4xl text-amber-600 font-bold "> New Project</h1>
      <Suspense fallback={<h2>Loading...</h2>}>
        <TestComponent />
      </Suspense>
    </main>
  );
}
