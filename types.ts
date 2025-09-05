/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */

export type AttendanceStatus = 'Hadir' | 'Sakit' | 'Izin' | 'Alpa';

export interface Student {
  id: string;
  name: string;
}

export interface Class {
  id: string;
  name: string;
  students: Student[];
}

export type DailyAttendance = Record<string, AttendanceStatus>;

export type AttendanceData = Record<string, Record<string, DailyAttendance>>;
