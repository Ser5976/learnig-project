import TypeComponent from '@/feature/type/components/type-component';
import { Suspense } from 'react';

export default function TypePage() {
  return (
    <div className="container mx-auto py-8">
      <Suspense fallback={<h1>Loading...</h1>}>
        <TypeComponent />
      </Suspense>
    </div>
  );
}
