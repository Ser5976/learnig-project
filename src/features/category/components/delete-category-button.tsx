'use client';

import { useTransition } from 'react';
import { MdDelete } from 'react-icons/md';
import { Button } from '@/components/ui/button';
import { deleteCategoryAction } from '../actions';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';

interface DeleteCategoryButtonProps {
  categoryId: string;
}

export const DeleteCategoryButton = ({
  categoryId,
}: DeleteCategoryButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteCategoryAction({ categoryId });
        toast.success('Категория успешно удалена');
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Ошибка при удалении категории'
        );
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      disabled={isPending}
      className="h-8 w-8 p-0 shadow-sm hover:shadow-md cursor-pointer"
    >
      {isPending ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <MdDelete size={20} />
      )}
    </Button>
  );
};
