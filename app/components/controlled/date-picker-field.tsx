"use client";

import { cn } from "@/lib/utils";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { UseControllerProps } from "react-hook-form";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  parseDateFromInputString,
  formatDateToInputString,
} from "@/app/utils/format-date-input";

interface DatePickerFieldProps extends UseControllerProps {
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  maxDate?: Date;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  label,
  placeholder = "Data...",
  className,
  disabled = false,
  maxDate,
  ...controllerProps
}) => {
  return (
    <FormField
      {...controllerProps}
      render={({ field }) => {
        return (
          <FormItem className="flex flex-col gap-1">
            {label && (
              <FormLabel htmlFor={field.name} className="font-bold">
                {label}
              </FormLabel>
            )}
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                      "min-w-52 justify-start text-left font-normal",
                      !field.value && "text-muted-foreground",
                      className,
                    )}
                  >
                    <CalendarIcon className="mr-1 h-4 w-4" />
                    {field.value ? (
                      format(
                        parseDateFromInputString(field.value) || new Date(),
                        "dd/MM/yyyy",
                        {
                          locale: ptBR,
                        },
                      )
                    ) : (
                      <span>{placeholder}</span>
                    )}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0" align="start">
                <Calendar
                  mode="single"
                  selected={parseDateFromInputString(field.value)}
                  captionLayout="dropdown-years"
                  onSelect={(date) => {
                    if (date) {
                      field.onChange(formatDateToInputString(date));
                    } else {
                      field.onChange("");
                    }
                  }}
                  className="w-full items-center rounded-md border shadow-sm"
                  disabled={(date) => {
                    if (disabled) return true;
                    if (maxDate) return date > maxDate;
                    return false;
                  }}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default DatePickerField;
