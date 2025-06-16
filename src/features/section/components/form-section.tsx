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
import { toast } from 'react-toastify';
import { Loader2 } from 'lucide-react';
import { Section } from '@prisma/client';
import { createSectionSchema } from '@/validation/section-validation';
import { useUpdateSection } from '../hooks/useUpdateSection';
import { useCreateSection } from '../hooks/useCreateSection';

type SectionFormProps = {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  section?: Section;
};

export function SectionForm({ setIsOpen, section }: SectionFormProps) {
  const { mutate: updateSectionMutation, isPending: isUpdating } =
    useUpdateSection(setIsOpen);
  const { mutate: createSectionMutation, isPending: isCreating } =
    useCreateSection(setIsOpen);
  const isLoading = isUpdating || isCreating;
  const form = useForm<z.infer<typeof createSectionSchema>>({
    resolver: zodResolver(createSectionSchema),
    defaultValues: {
      name: section ? section.name : '',
    },
  });

  async function onSubmit(values: z.infer<typeof createSectionSchema>) {
    try {
      if (section) {
        // Update existing type
        await updateSectionMutation({
          id: section.id,
          name: values.name,
        });
      } else {
        // Create new type
        await createSectionMutation({ name: values.name });
      }
      setIsOpen(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Произошла ошибка при сохранении секции'
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
                <Input placeholder="Введите название секции" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {section ? 'Обновление...' : 'Создание...'}
            </>
          ) : section ? (
            'Обновить'
          ) : (
            'Создать'
          )}
        </Button>
      </form>
    </Form>
  );
}
