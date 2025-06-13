'use client';

import { useTransition } from 'react';
import { MdDelete } from 'react-icons/md';
import { Button } from '@/components/ui/button';
import { deleteTypeAction } from '../actions';
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';

interface DeleteTypeButtonProps {
  typeId: string;
}

export const DeleteTypeButton = ({ typeId }: DeleteTypeButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteTypeAction({ typeId });
        toast.success('Тип успешно удален');
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : 'Ошибка при удалении типа'
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
      className="h-8 w-8 p-0 shadow-sm hover:shadow-md"
    >
      {isPending ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <MdDelete size={20} />
      )}
    </Button>
  );
};
