'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TypeForm } from './form-type';

export function CreateTypeButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer shadow-sm hover:shadow-md">
          <Plus className="h-4 w-4 mr-2" />
          Создать тип
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Создать новый тип</DialogTitle>
        </DialogHeader>
        <TypeForm setIsOpen={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
}
