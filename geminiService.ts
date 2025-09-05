/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
import { Class, AttendanceData } from './types';

const CLASSES_KEY = 'attendance_classes';
const ATTENDANCE_KEY = 'attendance_data';

const generateInitialData = (): { classes: Class[], attendance: AttendanceData } => {
  const classes: Class[] = [];
  const classPrefixes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  classPrefixes.forEach((prefix) => {
    const classId = `class-10-${prefix.toLowerCase()}`;
    const students = [];
    for (let i = 1; i <= 50; i++) {
      students.push({ id: `${classId}-student-${i}`, name: `Siswa ${i}` });
    }
    classes.push({
      id: classId,
      name: `Kelas 10 ${prefix}`,
      students: students,
    });
  });

  return { classes, attendance: {} };
};

export const loadState = (): { classes: Class[], attendance: AttendanceData } => {
  try {
    const serializedClasses = localStorage.getItem(CLASSES_KEY);
    const serializedAttendance = localStorage.getItem(ATTENDANCE_KEY);

    if (serializedClasses === null) {
      const initialState = generateInitialData();
      saveState(initialState.classes, initialState.attendance);
      return initialState;
    }

    const classes = JSON.parse(serializedClasses);
    const attendance = serializedAttendance ? JSON.parse(serializedAttendance) : {};
    return { classes, attendance };
  } catch (err) {
    console.error("Could not load state", err);
    return generateInitialData();
  }
};

export const saveState = (classes: Class[], attendance: AttendanceData) => {
  try {
    const serializedClasses = JSON.stringify(classes);
    const serializedAttendance = JSON.stringify(attendance);
    localStorage.setItem(CLASSES_KEY, serializedClasses);
    localStorage.setItem(ATTENDANCE_KEY, serializedAttendance);
  } catch (err) {
    console.error("Could not save state", err);
  }
};
