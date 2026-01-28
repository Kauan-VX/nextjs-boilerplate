import { z } from "zod";
import { SchemaMessageTypes } from "../utils/schema-message";

export const loginSchema = z.object({
  email: z
    .string({ message: SchemaMessageTypes.INVALID_TYPE })
    .email({ message: SchemaMessageTypes.INVALID_EMAIL })
    .trim()
    .refine((value) => value !== "", {
      message: SchemaMessageTypes.REQUIRED_FIELD,
    }),
  password: z
    .string({ message: SchemaMessageTypes.INVALID_TYPE })
    .trim()
    .refine((value) => value !== "", {
      message: SchemaMessageTypes.REQUIRED_FIELD,
    }),
});

export const mfaSchema = z.object({
  mfa: z
    .string({ message: SchemaMessageTypes.INVALID_TYPE })
    .length(6, { message: "MFA deve ter 6 dígitos" })
    .regex(/^\d+$/, { message: "MFA deve conter apenas números" }),
});

export const loginWithMfaSchema = loginSchema.extend({
  mfa_token: z.string().optional(),
});

export type LoginFormDataType = z.infer<typeof loginSchema>;
export type MfaFormDataType = z.infer<typeof mfaSchema>;
export type LoginWithMfaDataType = z.infer<typeof loginWithMfaSchema>;
