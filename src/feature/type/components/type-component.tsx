import { getTypes } from '@/lib/sahared-data/get_types';
import { ModalUpdateType } from './modal-update-type';
import { DeleteTypeButton } from './delete-type-button';
import { CreateTypeButton } from './create-type-button';

export default async function TypeComponent() {
  const types = await getTypes();

  return (
    <div className="container text-amber-800 border border-amber-600 p-5">
      <div className="flex justify-between  items-center mb-8">
        <h1 className="text-2xl font-bold">Типы</h1>
        <CreateTypeButton />
      </div>
      {!types ? (
        <p className="text-red-600 text-sm font-medium mt-1">
          ⚠️ Что пошло не так
        </p>
      ) : types.length === 0 ? (
        <p className="text-lg text-gray-500">Данных нет</p>
      ) : (
        <div className="space-y-4">
          {types.map((type) => (
            <div
              key={type.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-lg font-medium">{type.name}</div>
              <div className="flex gap-2 justify-baseline">
                <ModalUpdateType type={type} />
                <DeleteTypeButton typeId={type.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
