'use client';

import { MdDelete } from 'react-icons/md';
import { deleteCategoryAction } from '../actions';
import { toast } from 'react-toastify';
import { useTransition } from 'react';
import { Loader2 } from 'lucide-react';

interface DeleteCategoryButtonProps {
  categoryId: string;
}

export function DeleteCategoryButton({
  categoryId,
}: DeleteCategoryButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    try {
      startTransition(async () => {
        await deleteCategoryAction(categoryId);
        toast.success('Категория успешно удалена');
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Ошибка при удалении категории');
    }
  };

  return (
    <button onClick={handleDelete} className="p-0" disabled={isPending}>
      {isPending ? (
        <Loader2 className="h-[18px] w-[18px] animate-spin" />
      ) : (
        <MdDelete size={18} className="cursor-pointer" />
      )}
    </button>
  );
}
