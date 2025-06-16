'use client';

import { useSectionQuery } from '../hooks/useSectionQuery';

export default function TestComponentClient() {
  const { data: sections, isError, isLoading } = useSectionQuery();

  return (
    <div className="container text-amber-800 border border-amber-600 p-5">
      {isError ? (
        <p className="text-red-600 text-sm font-medium mt-1">
          ⚠️ Что пошло не так
        </p>
      ) : isLoading ? (
        <h2>Loading...</h2>
      ) : sections?.length === 0 ? (
        <p className="text-lg text-gray-500">Данных нет</p>
      ) : (
        sections?.map((section) => {
          return <div key={section.id}>{section.name}</div>;
        })
      )}
    </div>
  );
}
