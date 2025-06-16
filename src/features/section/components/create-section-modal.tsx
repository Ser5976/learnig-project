'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MdAdd } from 'react-icons/md';
import { SectionForm } from './form-section';

export function CreateSectionModal() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer shadow-sm hover:shadow-md">
          <MdAdd className="mr-2 h-4 w-4" />
          Создать секцию
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создать секцию</DialogTitle>
        </DialogHeader>
        <SectionForm setIsOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
