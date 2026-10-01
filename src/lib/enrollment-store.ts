import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  students as initialStudents,
  courses as initialCourses,
  enrollments as initialEnrollments,
} from "@/lib/mock-data";
import type { Course, Enrollment, Student } from "@/lib/types";

type EnrollmentStore = {
  students: Student[];
  courses: Course[];
  enrollments: Enrollment[];

  addStudent: (student: Student) => void;
  removeStudent: (studentId: string) => void;
  addCourse: (course: Course) => void;
  removeInstructorFromCourse: (courseId: string, email: string) => void;
  removeCourse: (courseId: string) => void;
};

export const useEnrollmentStore = create<EnrollmentStore>()(
  persist(
    (set) => ({
      students: initialStudents,
      courses: initialCourses,
      enrollments: initialEnrollments,

      addStudent: (student) =>
        set((state) => ({ students: [...state.students, student] })),

      removeStudent: (studentId) =>
        set((state) => ({
          students: state.students.filter((s) => s.studentId !== studentId),
          enrollments: state.enrollments.filter(
            (e) => e.studentId !== studentId,
          ),
        })),

      addCourse: (course) =>
        set((state) => ({ courses: [...state.courses, course] })),

      removeInstructorFromCourse: (courseId, email) =>
        set((state) => ({
          courses: state.courses.map((course) =>
            course.courseId === courseId
              ? {
                  ...course,
                  instructors: course.instructors.filter(
                    (i) => i.email.toLowerCase() !== email.toLowerCase(),
                  ),
                }
              : course,
          ),
        })),

      removeCourse: (courseId) =>
        set((state) => ({
          courses: state.courses.filter((c) => c.courseId !== courseId),
          enrollments: state.enrollments.filter((e) => e.courseId !== courseId),
        })),
    }),
    {
      name: "lab17-2569-653",
      version: 2,
      partialize: (state) => ({
        students: state.students,
        courses: state.courses,
      }),
    },
  ),
);
