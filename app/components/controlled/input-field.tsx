"use client";

import { FieldValues, UseControllerProps } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

interface InputFieldProps<T extends FieldValues> extends UseControllerProps<T> {
  label?: string;
  placeholder?: string;
  type?: string;
  className?: string;
  disabled?: boolean;
  autoComplete?: string;
  step?: string;
  displayValue?: string;
  mask?: (value: string) => string;
}

const InputField = <T extends FieldValues>({
  label,
  placeholder,
  type = "text",
  className,
  disabled,
  autoComplete = "off",
  step,
  displayValue,
  mask,
  ...controllerProps
}: InputFieldProps<T>) => {
  return (
    <FormField
      {...controllerProps}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-1">
          {label && (
            <FormLabel htmlFor={field.name} className="font-bold">
              {label}
            </FormLabel>
          )}
          <FormControl>
            {displayValue !== undefined && disabled ? (
              <div>
                <Input
                  id={field.name}
                  type={type}
                  placeholder={placeholder}
                  className={className}
                  disabled={disabled}
                  autoComplete={autoComplete}
                  step={step}
                  value={displayValue}
                  onChange={() => {}}
                  ref={field.ref}
                  onBlur={field.onBlur}
                />
                <input
                  type="hidden"
                  name={field.name}
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              </div>
            ) : (
              <Input
                id={field.name}
                type={type}
                placeholder={placeholder}
                className={className}
                disabled={disabled}
                autoComplete={autoComplete}
                step={step}
                value={
                  field.value === undefined || field.value === null
                    ? ""
                    : mask
                      ? mask(String(field.value))
                      : field.value
                }
                onChange={(e) => {
                  if (type === "number") {
                    const value = e.target.value;
                    field.onChange(value === "" ? undefined : Number(value));
                  } else if (mask) {
                    const maskedValue = mask(e.target.value);
                    field.onChange(maskedValue);
                  } else {
                    field.onChange(e.target.value);
                  }
                }}
                name={field.name}
                ref={field.ref}
                onBlur={field.onBlur}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default InputField;
