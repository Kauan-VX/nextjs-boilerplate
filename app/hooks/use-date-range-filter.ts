import { useMemo, useState } from "react";
import { parseLocalDate } from "../utils/format-date-input";

export type DateRangePreset = "today" | "7days" | "30days" | "custom";

export type CustomDateRange = {
  start: Date;
  end: Date;
};

export type DateRange = {
  start: Date;
  end: Date;
};

export interface UseDateRangeFilterParams<T> {
  data: T[];
  dateField?: keyof T;
  enabled?: boolean;
  defaultPreset?: DateRangePreset;
  customDateStart?: string;
  customDateEnd?: string;
}

export interface UseDateRangeFilterReturn<T> {
  filteredData: T[];
  preset: DateRangePreset;
  setPreset: (preset: DateRangePreset) => void;
  customRange: CustomDateRange | null;
  setCustomRange: (range: CustomDateRange | null) => void;
  dateRange: DateRange;
}

export function useDateRangeFilter<T>({
  data,
  dateField,
  enabled = true,
  defaultPreset = "today",
  customDateStart,
  customDateEnd,
}: UseDateRangeFilterParams<T>): UseDateRangeFilterReturn<T> {
  const [preset, setPreset] = useState<DateRangePreset>(defaultPreset);
  const [customRange, setCustomRange] = useState<CustomDateRange | null>(null);

  /**
   * Calculate date range based on preset or custom range
   */
  const dateRange = useMemo((): DateRange => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      59,
      999,
    );

    switch (preset) {
      case "today":
        return { start: today, end: endOfToday };

      case "7days": {
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        return { start: sevenDaysAgo, end: endOfToday };
      }

      case "30days": {
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        return { start: thirtyDaysAgo, end: endOfToday };
      }

      case "custom": {
        // Prioritize customRange state, fallback to customDateStart/End props
        if (customRange) {
          // Set start to beginning of day and end to end of day
          const start = new Date(customRange.start);
          start.setHours(0, 0, 0, 0);
          const end = new Date(customRange.end);
          end.setHours(23, 59, 59, 999);
          return { start, end };
        }

        const customStart = customDateStart
          ? parseLocalDate(customDateStart) || today
          : today;
        const customEnd = customDateEnd
          ? parseLocalDate(customDateEnd) || endOfToday
          : endOfToday;

        // Ensure start is at beginning of day and end is at end of day
        customStart.setHours(0, 0, 0, 0);
        customEnd.setHours(23, 59, 59, 999);

        return { start: customStart, end: customEnd };
      }

      default:
        return { start: today, end: endOfToday };
    }
  }, [preset, customRange, customDateStart, customDateEnd]);

  /**
   * Filter data based on date range
   */
  const filteredData = useMemo(() => {
    // If not enabled or no dateField specified, return original data
    if (!enabled || !dateField) return data;

    const startTime = dateRange.start.getTime();
    const endTime = dateRange.end.getTime();

    return data.filter((item) => {
      const itemValue = item[dateField];

      // Skip items with null/undefined date values
      if (itemValue == null) return false;

      // Parse the date in local timezone to avoid timezone shifts
      const itemDate = parseLocalDate(itemValue as string | number | Date);
      if (!itemDate) return false;

      const itemTime = itemDate.getTime();

      // Check if item date is within range (inclusive)
      return itemTime >= startTime && itemTime <= endTime;
    });
  }, [data, enabled, dateField, dateRange]);

  return {
    filteredData,
    preset,
    setPreset,
    customRange,
    setCustomRange,
    dateRange,
  };
}
