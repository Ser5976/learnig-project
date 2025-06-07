import { getCategories } from '@/lib/api/get-categories';

export default async function TestComponentFirst() {
  const categories = await getCategories();
  //console.log(categories);

  return (
    <div className=" container text-amber-800 border border-amber-600 p-5 ">
      <h1 className=" py-2 text-xl"> Component first</h1>
      {!categories ? (
        <p className="text-red-600  text-sm font-medium mt-1">
          ⚠️ Что пошло не так
        </p>
      ) : categories.length === 0 ? (
        <p className="text-lg  text-gray-500">Данных нет</p>
      ) : (
        categories.map((category) => {
          return <div key={category.id}>{category.name}</div>;
        })
      )}
    </div>
  );
}
