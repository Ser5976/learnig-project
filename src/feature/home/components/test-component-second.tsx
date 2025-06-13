import { getTypes } from '../../../lib/sahared-data/get_types';

export default async function TestComponentSecond() {
  const types = await getTypes();

  return (
    <div className=" container text-amber-800 border border-amber-600 p-5 ">
      <h1 className=" py-2 text-xl">
        Получение данных на сервере при помощи fech
      </h1>
      {!types ? (
        <p className="text-red-600  text-sm font-medium mt-1">
          ⚠️ Что пошло не так
        </p>
      ) : types.length === 0 ? (
        <p className="text-lg  text-gray-500">Данных нет</p>
      ) : (
        types.map((type) => {
          return <div key={type.id}>{type.name}</div>;
        })
      )}
    </div>
  );
}
