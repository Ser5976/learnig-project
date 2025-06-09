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
import { formSchema } from '../validation';
import { Category } from '@prisma/client';
import { updateCategoryAction } from './actions';
import { toast } from 'react-toastify';

type CategoryFormProps = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  category?: Category;
};

export function CategoryForm({ setIsOpen, category }: CategoryFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category ? category.name : '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (category) {
      const udateData = { categoryId: category.id, name: values.name };
      try {
        updateCategoryAction(udateData);
        toast.success('Youre avatar has been changed');
        setIsOpen(false);
      } catch (error) {
        console.log(error);
        toast.error('Something went wrong');
      }
    } else {
      setIsOpen(false);
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
              <FormLabel>Имя пользователя</FormLabel>
              <FormControl>
                <Input placeholder="Введите имя" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Отправить</Button>
      </form>
    </Form>
  );
}
