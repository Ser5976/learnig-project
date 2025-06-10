import { getCategories } from '@/lib/sahared-data/get-categories';
import { ModalUpdateCategory } from './modal-update-category';
import { CreateCategoryButton } from './create-category-button';
import { DeleteCategoryButton } from './delete-category-button';

export default async function TestComponentFirst() {
  const categories = await getCategories();

  return (
    <div className="container text-amber-800 border border-amber-600 p-5">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Категории</h1>
        <CreateCategoryButton />
      </div>
      {!categories ? (
        <p className="text-red-600 text-sm font-medium mt-1">
          ⚠️ Что пошло не так
        </p>
      ) : categories.length === 0 ? (
        <p className="text-lg text-gray-500">Данных нет</p>
      ) : (
        <div className="space-y-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-lg font-medium">{category.name}</div>
              <div className="flex gap-2 justify-baseline">
                <ModalUpdateCategory category={category} />
                <DeleteCategoryButton categoryId={category.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
