'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Category } from '@prisma/client';

import { useState } from 'react';
import { CategoryForm } from './form-category';
import { MdEdit } from 'react-icons/md';
import { Button } from '@/components/ui/button';

export const ModalUpdateCategory = ({ category }: { category: Category }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <MdEdit size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Updating the category</DialogTitle>
        </DialogHeader>
        <CategoryForm setIsOpen={setIsOpen} category={category} />
      </DialogContent>
    </Dialog>
  );
};
