'use client';

import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
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
    <Button variant="destructive" size="icon" onClick={handleDelete}>
      <Trash2 color="black" className="h-4 w-4" />
      <span className="sr-only">Удалить</span>
    </Button>
  );
}
