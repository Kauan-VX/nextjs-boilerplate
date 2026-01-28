import { parseDateFromInputString } from "@/app/utils/format-date-input";
import { differenceInDays } from "date-fns";
import z from "zod";

export const customDateRangeSchema = z
  .object({
    startDate: z.string().min(1, "Data inicial é obrigatória"),
    endDate: z.string().min(1, "Data final é obrigatória"),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;

      const start = parseDateFromInputString(data.startDate);
      const end = parseDateFromInputString(data.endDate);

      if (!start || !end) return true;

      return end >= start;
    },
    {
      message: "A data final deve ser posterior ou igual à data inicial",
      path: ["endDate"],
    },
  )
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) return true;

      const start = parseDateFromInputString(data.startDate);
      const end = parseDateFromInputString(data.endDate);

      if (!start || !end) return true;

      const daysDiff = differenceInDays(end, start);
      return daysDiff <= 30;
    },
    {
      message: "O período máximo permitido é de 30 dias",
      path: ["endDate"],
    },
  );

export type CustomDateRangeFormData = z.infer<typeof customDateRangeSchema>;
