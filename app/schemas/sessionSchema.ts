import { z } from "zod";

export const sessionSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    tutor: z.string().min(1, "Tutor is required"),
    student: z.string().min(1, "Student is required"),
    date: z.string().min(1, "Date is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    notes: z.string().optional(),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: "End time must be after start time",
    path: ["endTime"],
  });
