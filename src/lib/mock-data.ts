import type { Student, Course, Enrollment } from "@/lib/types";

export const students: Student[] = [
  {
    studentId: "650610001",
    firstName: "Matt",
    lastName: "Damon",
    program: "CPE",
    interests: ["web", "mobile"],
    emails: [{ address: "matt.damon@cmu.ac.th" }],
  },
  {
    studentId: "650610002",
    firstName: "Cillian",
    lastName: "Murphy",
    program: "CPE",
    courses: ["261207", "261497"],
    interests: ["ai"],
    emails: [
      { address: "cillian.murphy@cmu.ac.th" },
      { address: "cillian.m@gmail.com" },
    ],
  },
  {
    studentId: "650610003",
    firstName: "Emily",
    lastName: "Blunt",
    program: "ISNE",
    courses: ["269101", "261497"],
    interests: ["network", "web", "ai"],
    emails: [{ address: "emily.blunt@cmu.ac.th" }],
  },
];

export const courses: Course[] = [
  {
    courseId: "261207",
    courseTitle: "Basic Computer Engineering Lab",
    instructors: [
      { name: "Dome", email: "dome@cmu.ac.th" },
      { name: "Chanadda", email: "chanadda@cmu.ac.th" },
    ],
    program: "CPE",
    semester: "1",
    description: "ปฏิบัติการพื้นฐานวิศวกรรมคอมพิวเตอร์",
    notifyByEmail: true,
  },
  {
    courseId: "261497",
    courseTitle: "Full Stack Development",
    instructors: [
      { name: "Dome", email: "dome@cmu.ac.th" },
      { name: "Nirand", email: "nirand@cmu.ac.th" },
      { name: "Chanadda", email: "chanadda@cmu.ac.th" },
    ],
    program: "CPE",
    semester: "2",
    description: "",
    notifyByEmail: false,
  },
  {
    courseId: "269101",
    courseTitle: "Introduction to Information Systems and Network Engineering",
    instructors: [{ name: "KENNETH COSH", email: "kenneth.cosh@cmu.ac.th" }],
    program: "ISNE",
    semester: "1",
    description: "",
    notifyByEmail: false,
  },
];

export const enrollments: Enrollment[] = [
  { studentId: "650610002", courseId: "261207" },
  { studentId: "650610002", courseId: "261497" },
  { studentId: "650610003", courseId: "269101" },
  { studentId: "650610003", courseId: "261497" },
];

/**
 * นักศึกษาที่ "ล็อกอินอยู่" ในหน้านี้ — โปรเจกต์นี้ตัดระบบ Login/Role (ADMIN vs STUDENT)
 * ออกไปทั้งหมดตามที่ต้องการ จึงกำหนดผู้ใช้ปัจจุบันไว้ตรงนี้ที่เดียว
 * เปลี่ยนค่านี้เพื่อดูมุมมองของนักศึกษาคนอื่นได้
 */
export const CURRENT_STUDENT_ID = "650610002";
export const currentStudent = students.find(
  (s) => s.studentId === CURRENT_STUDENT_ID,
)!;