/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
import React from 'react';
import { Class } from '../types';

interface ClassListProps {
  classes: Class[];
  onSelectClass: (classId: string) => void;
  onAddClass: () => void;
  onEditClass: (classId: string) => void;
  onDeleteClass: (classId: string) => void;
}

export const ClassList: React.FC<ClassListProps> = ({ classes, onSelectClass, onAddClass, onEditClass, onDeleteClass }) => {
  return (
    <div className="p-4 sm:p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Daftar Kelas</h1>
        <button onClick={onAddClass} className="app-button">Tambah Kelas Baru</button>
      </div>
      <div className="space-y-3">
        {classes.map(cls => (
          <div key={cls.id} className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
            <span className="text-lg font-medium text-gray-700">{cls.name}</span>
            <div className="flex items-center gap-2">
              <button onClick={() => onSelectClass(cls.id)} className="app-button">Kelola Absensi</button>
              <button onClick={() => onEditClass(cls.id)} className="app-button-secondary">Ubah</button>
              <button onClick={() => onDeleteClass(cls.id)} className="app-button-danger">Hapus</button>
            </div>
          </div>
        ))}
      </div>
       <footer className="text-center text-sm text-gray-500 mt-8">
          <p>Data absensi disimpan secara lokal di browser Anda.</p>
        </footer>
    </div>
  );
};
