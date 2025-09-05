/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
import React, { useState, useEffect } from 'react';
import { Class, AttendanceStatus, DailyAttendance } from '../types';
import { ATTENDANCE_STATUSES, STATUS_COLORS } from '../constants';

interface AttendanceSheetProps {
  selectedClass: Class;
  onSave: (date: string, attendance: DailyAttendance) => void;
  onBack: () => void;
  onViewReports: () => void;
  initialAttendance: DailyAttendance;
}

const formatDate = (date: Date) => date.toISOString().split('T')[0];

export const AttendanceSheet: React.FC<AttendanceSheetProps> = ({ selectedClass, onSave, onBack, onViewReports, initialAttendance }) => {
  const [attendance, setAttendance] = useState<DailyAttendance>(initialAttendance || {});
  const [currentDate, setCurrentDate] = useState(new Date());
  
  useEffect(() => {
    setAttendance(initialAttendance || {});
  }, [initialAttendance]);
  
  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };
  
  const handleSave = () => {
    onSave(formatDate(currentDate), attendance);
    alert('Absensi berhasil disimpan!');
  };

  const handleSetAll = (status: AttendanceStatus) => {
    const newAttendance: DailyAttendance = {};
    selectedClass.students.forEach(student => {
      newAttendance[student.id] = status;
    });
    setAttendance(newAttendance);
  }

  return (
    <div className="p-4 sm:p-6 h-full flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Absensi {selectedClass.name}</h2>
        <div className="flex items-center gap-2">
            <button onClick={onBack} className="app-button-secondary">Kembali ke Daftar Kelas</button>
            <button onClick={onViewReports} className="app-button-secondary">Lihat Laporan</button>
        </div>
      </div>
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-gray-700">Tanggal: {formatDate(currentDate)}</span>
        <button onClick={handleSave} className="app-button">Simpan Absensi</button>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <span className="text-sm font-medium text-gray-600 self-center">Atur Semua:</span>
        {ATTENDANCE_STATUSES.map(status => (
          <button key={status} onClick={() => handleSetAll(status)} className={`px-3 py-1 text-xs font-semibold rounded-full ${STATUS_COLORS[status]}`}>{status}</button>
        ))}
      </div>
      <div className="flex-grow overflow-auto border rounded-lg">
        <table className="min-w-full bg-white divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2">Nama Siswa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {selectedClass.students.map(student => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex gap-2">
                    {ATTENDANCE_STATUSES.map(status => (
                        <button key={status} onClick={() => handleStatusChange(student.id, status)} 
                            className={`px-3 py-1 text-xs font-semibold rounded-full transition-transform transform hover:scale-110 ${attendance[student.id] === status ? STATUS_COLORS[status] : 'bg-gray-200 text-gray-700'}`}>
                            {status}
                        </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
