import { getCategories } from '@/lib/sahared-data/get-categories';
import { ModalUpdateCategory } from './modal-update-category';
import { ModalCreateCategory } from './modal-create-category';

export default async function TestComponentFirst() {
  console.log('рендер TestComponentFirst ');
  const categories = await getCategories();
  //console.log(categories);

  return (
    <div className=" container text-amber-800 border border-amber-600 p-5 ">
      <h1 className=" py-2 text-xl">
        Получение данных на сервере при помощи прямого запроса
      </h1>
      {!categories ? (
        <p className="text-red-600  text-sm font-medium mt-1">
          ⚠️ Что пошло не так
        </p>
      ) : categories.length === 0 ? (
        <p className="text-lg  text-gray-500">Данных нет</p>
      ) : (
        categories.map((category) => {
          return (
            <div className="flex justify-between" key={category.id}>
              <div className="">{category.name}</div>
              <div className=" flex gap-3">
                <ModalUpdateCategory category={category} />
                <ModalCreateCategory />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
