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
import { MdEdit } from 'react-icons/md';
import { SectionForm } from './form-section';
import { Section } from '@prisma/client';

export function UpdateSectionModal({ section }: { section: Section }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 p-0 shadow-sm hover:shadow-md cursor-pointer"
        >
          <MdEdit size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактировать секцию</DialogTitle>
        </DialogHeader>
        <SectionForm setIsOpen={setOpen} section={section} />
      </DialogContent>
    </Dialog>
  );
}
