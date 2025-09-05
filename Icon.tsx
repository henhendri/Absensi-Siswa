/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
import React, { useState, useMemo } from 'react';
import { Class, AttendanceData, AttendanceStatus } from '../types';
import { STATUS_COLORS } from '../constants';

interface ReportViewProps {
  selectedClass: Class;
  attendanceData: AttendanceData;
  onBack: () => void;
}

const getWeekDateRange = (date: Date): [Date, Date] => {
  const start = new Date(date);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  start.setDate(diff);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return [start, end];
};

const formatDate = (date: Date) => date.toISOString().split('T')[0];

export const ReportView: React.FC<ReportViewProps> = ({ selectedClass, attendanceData, onBack }) => {
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');
  const [currentDate, setCurrentDate] = useState(new Date());

  const classAttendance = attendanceData[selectedClass.id] || {};

  const reportData = useMemo(() => {
    const summary: Record<string, Record<AttendanceStatus, number>> = {};
    selectedClass.students.forEach(student => {
      summary[student.id] = { Hadir: 0, Sakit: 0, Izin: 0, Alpa: 0 };
    });

    let startDate: Date, endDate: Date;
    if (viewMode === 'weekly') {
      [startDate, endDate] = getWeekDateRange(currentDate);
    } else {
      startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    }

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = formatDate(new Date(d));
      const dailyRecord = classAttendance[dateStr];
      if (dailyRecord) {
        selectedClass.students.forEach(student => {
          const status = dailyRecord[student.id];
          if (status) {
            summary[student.id][status]++;
          }
        });
      }
    }
    return summary;
  }, [viewMode, currentDate, classAttendance, selectedClass.students]);
  
  const handleDateChange = (offset: number) => {
    const newDate = new Date(currentDate);
    if (viewMode === 'weekly') {
      newDate.setDate(newDate.getDate() + offset * 7);
    } else {
      newDate.setMonth(newDate.getMonth() + offset);
    }
    setCurrentDate(newDate);
  };

  const [weekStart, weekEnd] = getWeekDateRange(currentDate);
  const dateDisplay = viewMode === 'weekly' 
    ? `${formatDate(weekStart)} - ${formatDate(weekEnd)}` 
    : `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`;

  return (
    <div className="p-4 sm:p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Laporan Absensi - {selectedClass.name}</h2>
        <button onClick={onBack} className="app-button-secondary">Kembali</button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex rounded-md shadow-sm">
            <button onClick={() => setViewMode('weekly')} className={`app-button-tab ${viewMode === 'weekly' ? 'active' : ''}`}>Mingguan</button>
            <button onClick={() => setViewMode('monthly')} className={`app-button-tab ${viewMode === 'monthly' ? 'active' : ''}`}>Bulanan</button>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={() => handleDateChange(-1)} className="app-button-secondary p-2">‹</button>
            <span className="font-semibold text-gray-700 w-48 text-center">{dateDisplay}</span>
            <button onClick={() => handleDateChange(1)} className="app-button-secondary p-2">›</button>
        </div>
      </div>
      
      <div className="flex-grow overflow-auto">
        <table className="min-w-full bg-white divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Siswa</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Hadir</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Sakit</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Izin</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Alpa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {selectedClass.students.map(student => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                <td className="px-6 py-4 text-center text-sm text-gray-500">{reportData[student.id].Hadir}</td>
                <td className="px-6 py-4 text-center text-sm text-gray-500">{reportData[student.id].Sakit}</td>
                <td className="px-6 py-4 text-center text-sm text-gray-500">{reportData[student.id].Izin}</td>
                <td className="px-6 py-4 text-center text-sm text-gray-500">{reportData[student.id].Alpa}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
