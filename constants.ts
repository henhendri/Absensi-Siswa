/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
import { AttendanceStatus } from './types';

export const ATTENDANCE_STATUSES: AttendanceStatus[] = ['Hadir', 'Sakit', 'Izin', 'Alpa'];

export const STATUS_COLORS: Record<AttendanceStatus, string> = {
  Hadir: 'bg-green-100 text-green-800',
  Sakit: 'bg-yellow-100 text-yellow-800',
  Izin: 'bg-blue-100 text-blue-800',
  Alpa: 'bg-red-100 text-red-800',
};
