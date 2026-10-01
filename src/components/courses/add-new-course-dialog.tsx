import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, RotateCcw, UserPlus, X } from "lucide-react";
import {
  Controller,
  useFieldArray,
  useForm,
  type DefaultValues,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "../ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import {
  createCourseFormSchema,
  MAX_EMAILS,
  MAX_COURSTITLE,
  type CourseFormValues,
} from "@/lib/schemas/course-schema";
import { Switch } from "@/components/ui/switch";
import { useEnrollmentStore } from "@/lib/enrollment-store";

const programOptions = [
  { value: "CPE", label: "CPE — วิศวกรรมคอมพิวเตอร์" },
  { value: "ISNE", label: "ISNE — วิศวกรรมระบบสารสนเทศและเครือข่าย" },
];

const emptyCourseForm: DefaultValues<CourseFormValues> = {
  courseId: "",
  courseTitle: "",
  instructors: [{ name: "", email: "" }],
  program: undefined,
  semester: "",
  description: "",
  notifyByEmail: false,
};
/**
 *   (Lab 17): เขียนฟอร์มนี้ใหม่ด้วย Zod + React Hook Form
 *   (ดูตัวอย่างใน components/students/add-new-student-dialog.tsx)
 *   - schema ใหม่ที่ src/lib/schemas/course-schema.ts (แทน course-validation.ts)
 *   - ผู้สอนเป็น Array Fields (useFieldArray) — ชื่อ + อีเมล @cmu.ac.th, 1–3 คน
 *   - หลักสูตร (Select), ภาคการศึกษา (Radio Group), รายละเอียด (Textarea 0/100),
 *     รับข่าวสารทางอีเมล (Switch)
 */
export function AddNewCourseDialog() {
  const addCourse = useEnrollmentStore((s) => s.addCourse);
  const courses = useEnrollmentStore((s) => s.courses);
  const [open, setOpen] = useState(false);

  const schema = useMemo(() => createCourseFormSchema(courses), [courses]);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyCourseForm,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "instructors",
  });

  const instructorsError =
    form.formState.errors.instructors?.root ??
    form.formState.errors.instructors;

  const resetForm = () => form.reset(emptyCourseForm);

  const descriptionValue = form.watch("description") || "";

  function onSubmit(values: CourseFormValues) {
    addCourse({
      courseId: values.courseId.trim(),
      courseTitle: values.courseTitle.trim(),
      program: values.program,
      semester: values.semester as "1" | "2" | "3",
      instructors: values.instructors.map((i) => ({
        name: i.name.trim(),
        email: i.email.trim().toLowerCase(),
      })),
      description: values.description?.trim() || "",
      notifyByEmail: !!values.notifyByEmail,
    });
    resetForm();
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) resetForm();
      }}
    >
      <DialogTrigger render={<Button />}>
        <UserPlus className="h-4 w-4" />
        เพิ่มวิชา
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="grid gap-4"
        >
          <DialogHeader>
            <DialogTitle>เพิ่มวิชาใหม่</DialogTitle>
            <DialogDescription>
              ลองใส่รหัสวิชาไม่ครบ 6 หลัก ใส่รหัสที่มีอยู่แล้ว
              ใส่อีเมลผู้สอนที่ไม่ใช่ @cmu.ac.th หรือพิมพ์รายละเอียดเกิน 100
              ตัวอักษร แล้วกดบันทึก
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="courseId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="courseId">รหัสวิชา</FieldLabel>
                    <Input
                      {...field}
                      id="courseId"
                      placeholder="261305"
                      inputMode="numeric"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="courseTitle"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="courseTitle">ชื่อวิชา</FieldLabel>
                    <Input
                      {...field}
                      id="courseTitle"
                      placeholder="เช่น Mobile Application Development"
                      aria-invalid={fieldState.invalid}
                      onChange={(e) => {
                        field.onChange(e);
                        if (e.target.value.length > MAX_COURSTITLE) {
                          form.trigger("courseTitle");
                        }
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <Controller
              name="program"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="program">หลักสูตร</FieldLabel>
                  <Select
                    name={field.name}
                    items={programOptions}
                    value={field.value ?? null}
                    onValueChange={(v) => {
                      field.onChange(v);
                      field.onBlur();
                    }}
                  >
                    <SelectTrigger
                      id="program"
                      className="w-full"
                      aria-invalid={fieldState.invalid}
                      ref={field.ref}
                    >
                      <SelectValue placeholder="เลือกหลักสูตร" />
                    </SelectTrigger>
                    <SelectContent>
                      {programOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="semester"
              control={form.control}
              render={({ field, fieldState }) => (
                <FieldSet
                  data-invalid={fieldState.invalid}
                  className="data-[invalid=true]:text-destructive"
                >
                  <FieldLegend className="text-inherit">
                    ภาคการศึกษา
                  </FieldLegend>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="flex flex-wrap gap-4 pt-1"
                  >
                    <Field orientation="horizontal" className="w-auto">
                      <RadioGroupItem value="1" id="semester-1" />
                      <FieldLabel htmlFor="semester-1" className="font-normal">
                        ภาคการศึกษาที่ 1
                      </FieldLabel>
                    </Field>
                    <Field orientation="horizontal" className="w-auto">
                      <RadioGroupItem value="2" id="semester-2" />
                      <FieldLabel htmlFor="semester-2" className="font-normal">
                        ภาคการศึกษาที่ 2
                      </FieldLabel>
                    </Field>
                    <Field orientation="horizontal" className="w-auto">
                      <RadioGroupItem value="3" id="semester-3" />
                      <FieldLabel htmlFor="semester-3" className="font-normal">
                        ภาคฤดูร้อน
                      </FieldLabel>
                    </Field>
                  </RadioGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldSet>
              )}
            />

            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="course-description">
                    รายละเอียด (ไม่บังคับ)
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="course-description"
                    aria-invalid={fieldState.invalid}
                    placeholder="คำอธิบายสั้นๆ"
                    className="min-h-[120px]"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                  <FieldDescription>
                    {descriptionValue.length}/{MAX_COURSTITLE} ตัวอักษร
                  </FieldDescription>
                </Field>
              )}
            />

            <FieldSet data-invalid={!!instructorsError?.message}>
              <FieldLegend variant="label">ผู้สอน</FieldLegend>
              <FieldDescription>
                {fields.length}/{MAX_EMAILS} คน — กรอกชื่อผู้สอน และอีเมล
                name@cmu.ac.th (ห้ามซ้ำกัน)
              </FieldDescription>

              <FieldGroup className="gap-3">
                {fields.map((item, index) => (
                  <div key={item.id} className="flex items-start gap-2">
                    <span className="mt-1.5 w-5 shrink-0 text-sm text-muted-foreground">
                      {index + 1}.
                    </span>
                    <div className="grid grid-cols-2 gap-2 flex-1">
                      <Controller
                        name={`instructors.${index}.name`} // 👈 🚨 แก้ตรงนี้: เปลี่ยนจาก .email เป็น .name
                        control={form.control}
                        render={({
                          field: nameField,
                          fieldState: nameState,
                        }) => (
                          <Field data-invalid={nameState.invalid}>
                            <FieldContent>
                              <Input
                                {...nameField}
                                id={`name-${index}`}
                                placeholder="ชื่อผู้สอน" // 👈 🚨 แก้ตรงนี้: ปรับคำบอกใบ้
                                aria-invalid={nameState.invalid}
                              />
                              {nameState.invalid && (
                                <FieldError errors={[nameState.error]} />
                              )}
                            </FieldContent>
                          </Field>
                        )}
                      />

                      <Controller
                        name={`instructors.${index}.email`}
                        control={form.control}
                        render={({
                          field: emailField,
                          fieldState: emailState,
                        }) => (
                          <Field data-invalid={emailState.invalid}>
                            <FieldContent>
                              <Input
                                {...emailField}
                                id={`email-${index}`}
                                type="email"
                                placeholder="name@cmu.ac.th"
                                aria-invalid={emailState.invalid}
                              />
                              {emailState.invalid && (
                                <FieldError errors={[emailState.error]} />
                              )}
                            </FieldContent>
                          </Field>
                        )}
                      />
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`ลบผู้สอนลำดับที่ ${index + 1}`}
                      disabled={fields.length <= 1}
                      onClick={() => remove(index)}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ))}
              </FieldGroup>

              {/* ─── Array Validation: error ระดับ array ─── */}
              {instructorsError?.message && (
                <FieldError errors={[instructorsError]} />
              )}

              {/* ─── append({...}) ─── */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-fit"
                disabled={fields.length >= MAX_EMAILS}
                onClick={() => append({ name: "", email: "" })}
              >
                <Plus className="size-4" />
                เพิ่มผู้สอน
              </Button>
            </FieldSet>
            <Controller
              name="notifyByEmail"
              control={form.control}
              render={({ field }) => (
                <Field
                  orientation="horizontal"
                  className="items-center justify-between rounded-lg border p-4"
                >
                  <FieldContent>
                    <FieldLabel htmlFor="notifyByEmail">
                      รับข่าวสารทางอีเมล
                    </FieldLabel>
                    <FieldDescription>
                      แจ้งเตือนผู้สอนเมื่อเปิดลงทะเบียน
                    </FieldDescription>
                  </FieldContent>
                  <Switch
                    id="notifyByEmail"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter>
            {/* ล้างฟอร์ม — กลับเป็นค่าเริ่มต้น + ล้าง error โดยไม่ปิด popup */}
            <Button type="button" variant="outline" onClick={resetForm}>
              <RotateCcw className="h-4 w-4" />
              ล้างฟอร์ม
            </Button>
            <Button type="submit">บันทึก</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
