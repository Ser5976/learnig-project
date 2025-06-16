import CategoryComponent from '@/features/category/components/category-component';
import { Suspense } from 'react';

export default function CategoryPage() {
  return (
    <div className="container mx-auto py-8">
      <Suspense fallback={<h1>Loading...</h1>}>
        <CategoryComponent />
      </Suspense>
    </div>
  );
}
