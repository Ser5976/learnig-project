'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { CategoryForm } from './form-category';
import { MdAddCircle } from 'react-icons/md';

export const ModalCreateCategory = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <MdAddCircle size={18} className=" cursor-pointer" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add category</DialogTitle>
        </DialogHeader>
        <CategoryForm setIsOpen={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
};
