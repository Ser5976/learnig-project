import TestComponentFirst from '@/feature/category/components/test-component-first';
import { Suspense } from 'react';

export default function CategoryPage() {
  return (
    <div className="container mx-auto py-8">
      <Suspense fallback={<h1>Loading...</h1>}>
        <TestComponentFirst />
      </Suspense>
    </div>
  );
}
