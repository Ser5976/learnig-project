'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createCategorySchema } from '../validation';
import { Category } from '@prisma/client';
import { updateCategoryAction, createCategoryAction } from '../actions';
import { toast } from 'react-toastify';
import { useTransition } from 'react';
import { Loader2 } from 'lucide-react';

type CategoryFormProps = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  category?: Category;
};

export function CategoryForm({ setIsOpen, category }: CategoryFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof createCategorySchema>>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: category ? category.name : '',
    },
  });

  async function onSubmit(values: z.infer<typeof createCategorySchema>) {
    try {
      startTransition(async () => {
        if (category) {
          // Update existing category
          await updateCategoryAction({
            categoryId: category.id,
            name: values.name,
          });
          toast.success('Категория успешно обновлена');
        } else {
          // Create new category
          await createCategoryAction({ name: values.name });
          toast.success('Категория успешно создана');
        }
        setIsOpen(false);
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Произошла ошибка при сохранении категории'
      );
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-md"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название категории</FormLabel>
              <FormControl>
                <Input placeholder="Введите название категории" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {category ? 'Обновление...' : 'Создание...'}
            </>
          ) : category ? (
            'Обновить'
          ) : (
            'Создать'
          )}
        </Button>
      </form>
    </Form>
  );
}
