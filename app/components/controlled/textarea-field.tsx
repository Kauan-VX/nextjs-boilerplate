"use client";

import { FieldValues, UseControllerProps } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";

interface TextareaFieldProps<
  T extends FieldValues,
> extends UseControllerProps<T> {
  label?: string;
  placeholder?: string;
  className?: string;
  rows?: number;
}

const TextareaField = <T extends FieldValues>({
  label,
  placeholder,
  className,
  rows,
  ...controllerProps
}: TextareaFieldProps<T>) => {
  return (
    <FormField
      {...controllerProps}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          {label && (
            <FormLabel htmlFor={field.name} className="font-bold">
              {label}
            </FormLabel>
          )}
          <FormControl>
            <Textarea
              id={field.name}
              placeholder={placeholder}
              className={className}
              rows={rows}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TextareaField;
