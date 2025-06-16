'use client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Type } from '@prisma/client';
import { useState } from 'react';
import { TypeForm } from './form-type';
import { MdEdit } from 'react-icons/md';
import { Button } from '@/components/ui/button';

export const ModalUpdateType = ({ type }: { type: Type }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 p-0 shadow-sm hover:shadow-md cursor-pointer"
        >
          <MdEdit size={21} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Редактирование типа</DialogTitle>
        </DialogHeader>
        <TypeForm setIsOpen={setIsOpen} type={type} />
      </DialogContent>
    </Dialog>
  );
};
