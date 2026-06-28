'use client';
import * as React from 'react';
import { format } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export function DatePicker({ date, setDate, title, className, disabledBeforeDate }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className={`data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal ${className || ''}`}
        >
          <CalendarDays className="mr-2 h-4 w-4" />
          {date ? format(date, 'dd-MM-yyyy') : <span>{title ? title : 'Select a date'}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          disabled={{ before: disabledBeforeDate }}
          onSelect={date => {
            setDate && setDate(date || undefined);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
