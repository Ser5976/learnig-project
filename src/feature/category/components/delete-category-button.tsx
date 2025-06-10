'use client';

import { MdDelete } from 'react-icons/md';
import { deleteCategoryAction } from '../actions';
import { toast } from 'react-toastify';

interface DeleteCategoryButtonProps {
  categoryId: string;
}

export function DeleteCategoryButton({
  categoryId,
}: DeleteCategoryButtonProps) {
  const handleDelete = async () => {
    try {
      await deleteCategoryAction(categoryId);
      toast.success('Категория успешно удалена');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Ошибка при удалении категории');
    }
  };

  return (
    <button onClick={handleDelete} className="p-0">
      <MdDelete size={18} className="cursor-pointer" />
    </button>
  );
}
