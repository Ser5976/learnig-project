import { z } from 'zod';

export const formSchema = z.object({
  name: z
    .string()
    .min(2, 'Имя должно быть минимум 2 символа')
    .max(50, 'Имя слишком длинное'),
});
