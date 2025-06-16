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
import { createTypeSchema } from '../validation';
import { Type } from '@prisma/client';
import { updateTypeAction, createTypeAction } from '../actions';
import { toast } from 'react-toastify';
import { useTransition } from 'react';
import { Loader2 } from 'lucide-react';

type TypeFormProps = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  type?: Type;
};

export function TypeForm({ setIsOpen, type }: TypeFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof createTypeSchema>>({
    resolver: zodResolver(createTypeSchema),
    defaultValues: {
      name: type ? type.name : '',
    },
  });

  async function onSubmit(values: z.infer<typeof createTypeSchema>) {
    try {
      startTransition(async () => {
        if (type) {
          // Update existing type
          await updateTypeAction({
            typeId: type.id,
            name: values.name,
          });
          toast.success('Тип успешно обновлен');
        } else {
          // Create new type
          await createTypeAction({ name: values.name });
          toast.success('Тип успешно создан');
        }
        setIsOpen(false);
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Произошла ошибка при сохранении типа'
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
              <FormLabel>Название типа</FormLabel>
              <FormControl>
                <Input placeholder="Введите название типа" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {type ? 'Обновление...' : 'Создание...'}
            </>
          ) : type ? (
            'Обновить'
          ) : (
            'Создать'
          )}
        </Button>
      </form>
    </Form>
  );
}
