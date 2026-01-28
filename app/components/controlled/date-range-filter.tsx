"use client";

import { CustomDateRange } from "@/app/hooks/use-date-range-filter";
import {
  CustomDateRangeFormData,
  customDateRangeSchema,
} from "@/app/schemas/controlled/custom-date-range-schema";
import {
  formatDateToInputString,
  parseDateFromInputString,
} from "@/app/utils/format-date-input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import React from "react";
import { DateRange } from "react-day-picker";
import { Control, useController, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";

interface RangeCalendarProps {
  control: Control<CustomDateRangeFormData>;
  onChange?: (range: CustomDateRange | null) => void;
}

function RangeCalendar({ control, onChange }: RangeCalendarProps) {
  const { field: startField } = useController({
    name: "startDate",
    control,
  });

  const { field: endField } = useController({
    name: "endDate",
    control,
  });

  const startDate = parseDateFromInputString(startField.value);
  const endDate = parseDateFromInputString(endField.value);

  const dateRange: DateRange | undefined =
    startDate && endDate
      ? { from: startDate, to: endDate }
      : startDate
        ? { from: startDate, to: undefined }
        : undefined;

  const handleRangeSelect = (range: DateRange | undefined) => {
    if (range?.from) {
      startField.onChange(formatDateToInputString(range.from));
    } else {
      startField.onChange("");
    }

    if (range?.to) {
      endField.onChange(formatDateToInputString(range.to));
    } else {
      endField.onChange("");
    }

    if (range?.from && range?.to) {
      onChange?.({
        start: range.from,
        end: range.to,
      });
    } else {
      onChange?.(null);
    }
  };

  return (
    <Calendar
      mode="range"
      selected={dateRange}
      captionLayout="dropdown-years"
      onSelect={handleRangeSelect}
      numberOfMonths={2}
      className="w-full items-center rounded-md border shadow-sm"
    />
  );
}

export interface DateRangeFilterProps {
  value: CustomDateRange | null;
  onChange: (range: CustomDateRange | null) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export function DateRangeFilter({
  value,
  onChange,
  placeholder = "Selecione o período",
  label,
  className,
}: DateRangeFilterProps) {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  const form = useForm<CustomDateRangeFormData>({
    resolver: zodResolver(customDateRangeSchema),
    defaultValues: {
      startDate: value ? formatDateToInputString(value.start) : "",
      endDate: value ? formatDateToInputString(value.end) : "",
    },
  });

  // Update parent component when dates change (without closing popover)
  const handleRangeChange = (range: CustomDateRange | null) => {
    onChange(range);
  };

  const handleCancel = () => {
    form.reset({
      startDate: value ? formatDateToInputString(value.start) : "",
      endDate: value ? formatDateToInputString(value.end) : "",
    });
    setIsPopoverOpen(false);
  };

  const handlePopoverChange = (open: boolean) => {
    if (!open) {
      handleCancel();
    } else {
      form.reset({
        startDate: value ? formatDateToInputString(value.start) : "",
        endDate: value ? formatDateToInputString(value.end) : "",
      });
    }
    setIsPopoverOpen(open);
  };

  const displayText = React.useMemo(() => {
    if (!value) return placeholder;

    const startFormatted = format(value.start, "dd/MM/yyyy", { locale: ptBR });
    const endFormatted = value.end
      ? format(value.end, "dd/MM/yyyy", { locale: ptBR })
      : "";

    return `${startFormatted} - ${endFormatted}`;
  }, [value, placeholder]);

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {label && <label className="text-sm font-bold">{label}</label>}
      <Popover open={isPopoverOpen} onOpenChange={handlePopoverChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "min-w-52 justify-start text-left font-normal",
              !value && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-1 h-4 w-4" />
            <span>{displayText}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-lg p-0" align="start">
          <RangeCalendar control={form.control} onChange={handleRangeChange} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
