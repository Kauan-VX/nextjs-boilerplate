"use client";

import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { UseControllerProps } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

interface PasswordFieldProps extends UseControllerProps {
  label?: string;
  placeholder?: string;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  placeholder,
  ...controllerProps
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <FormField
      {...controllerProps}
      render={({ field }) => (
        <FormItem className="flex flex-col gap-4">
          {label && (
            <FormLabel htmlFor={field.name} className="font-bold">
              {label}
            </FormLabel>
          )}
          <FormControl>
            <div className="relative">
              <Input
                {...field}
                id={field.name}
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                className="pr-10"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute top-1/2 right-2 -translate-y-1/2 transform text-gray-500"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeClosed className="size-4" />
                ) : (
                  <Eye className="size-4" name="eye" />
                )}
              </button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default PasswordField;
