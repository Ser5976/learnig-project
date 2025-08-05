'use client';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import { MdDelete } from 'react-icons/md';
import { DeleteSectionInput } from '@/validation/section-validation';
import { useDeleteSection } from '../hooks/useDeleteSection';

interface DeleteSectionButtonProps {
  sectionId: DeleteSectionInput;
  sectionName: string;
}

export function DeleteSectionButton({
  sectionId,
  sectionName,
}: DeleteSectionButtonProps) {
  const { mutate: deleteSectionMutation, isPending } = useDeleteSection();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Удалить"
          className="h-8 w-8 p-0 shadow-sm hover:shadow-md cursor-pointer"
        >
          {isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <MdDelete size={20} />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Удалить секцию</AlertDialogTitle>
          <AlertDialogDescription>
            Вы уверены, что хотите удалить секцию &quot;{sectionName}&quot;? Это
            действие нельзя отменить.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className=" cursor-pointer">
            Отмена
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteSectionMutation(sectionId.id)}
            disabled={isPending}
            className="flex items-center gap-2 cursor-pointer"
          >
            {isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Удаление...
              </>
            ) : (
              <>Удалить</>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
