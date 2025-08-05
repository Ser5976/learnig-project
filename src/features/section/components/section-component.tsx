'use client';

import { UpdateSectionModal } from './update-section-modal';
import { DeleteSectionButton } from './delete-section-button';
import { Skeleton } from '@/components/ui/skeleton';
import { useSectionQuery } from '@/hooks/useSectionQuery';
import { CreateSectionModal } from './create-section-modal';

export function SectionComponent() {
  const { data: sections, isLoading, isError } = useSectionQuery();

  return (
    <div className="container text-amber-800 border border-amber-600 p-5">
      <div className="flex justify-between  items-center mb-8">
        <h1 className="text-2xl font-bold">Секции</h1>
        <CreateSectionModal />
      </div>
      {isError ? (
        <p className="text-red-600 text-sm font-medium mt-1">
          ⚠️ Что пошло не так
        </p>
      ) : isLoading ? (
        <Skeleton className="h-10 w-full" />
      ) : sections?.length === 0 ? (
        <p className="text-lg text-gray-500">Данных нет</p>
      ) : (
        <ul className="space-y-4">
          {sections?.map((section) => (
            <li
              key={section.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-lg font-medium">{section.name}</div>
              <div className="flex gap-2 justify-baseline">
                <UpdateSectionModal section={section} />
                <DeleteSectionButton
                  sectionId={{ id: section.id }}
                  sectionName={section.name}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
