import { z } from "zod";

import type { Course } from "@/lib/types";

export const MAX_COURSTITLE = 100;
export const MAX_EMAILS = 3;

// ใช้ร่วมกันระหว่างฟอร์ม (Checkbox) กับตารางจัดการนักศึกษา (แสดง label)
export const semesterOptions = [
  { id: "1", label: "ภาคการศึกษาที่ 1" },
  { id: "2", label: "ภาคการศึกษาที่ 2" },
  { id: "3", label: "ภาคฤดูร้อน" },
];

export const courseFormSchema = z.object({
  courseId: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "รหัสวิชาต้องเป็นตัวเลข 6 หลัก"),

  courseTitle: z
    .string()
    .trim()
    .min(1, "กรอกชื่อวิชา")
    .max(MAX_COURSTITLE, `ชื่อวิชายาวได้ไม่เกิน ${MAX_COURSTITLE} ตัวอักษร`),

  program: z.enum(["CPE", "ISNE"], { message: "เลือกหลักสูตร" }),

  semester: z.string().min(1, "เลือกภาคการศึกษา"),

  description: z
    .string()
    .max(MAX_COURSTITLE, `รายละเอียดยาวได้ไม่เกิน ${MAX_COURSTITLE} ตัวอักษร`),

  // Array Fields — array ของ object (useFieldArray ต้องการ object เพื่อผูก key ให้แต่ละแถว)
  instructors: z
    .array(
      z.object({
        name: z.string().trim().min(1, "กรอกชื่อผู้สอน"),
        email: z
          .string()
          .trim()
          .pipe(z.email("อีเมลไม่ถูกต้อง"))
          .refine(
            (v) => v.toLowerCase().endsWith("@cmu.ac.th"),
            "ต้องเป็นอีเมล @cmu.ac.th",
          ),
      }),
    )
    .min(1, "ต้องมีผู้สอนอย่างน้อย 1 คน")
    .max(MAX_EMAILS, `มีผู้สอนได้ไม่เกิน ${MAX_EMAILS} คน`)
    .refine((items) => {
      const emails = items
        .map((i) => i.email.trim().toLowerCase())
        .filter((e) => e !== "");
      return new Set(emails).size === emails.length;
    }, "อีเมลผู้สอนซ้ำกัน"),

  notifyByEmail: z.boolean(),
});

export type CourseFormValues = z.infer<typeof courseFormSchema>;

export function createCourseFormSchema(existingCourseId: Course[]) {
  return courseFormSchema.refine(
    (data) => !existingCourseId.some((s) => s.courseId === data.courseId),
    { message: "รหัสวิชานี้มีอยู่แล้ว", path: ["courseId"] },
  );
}
