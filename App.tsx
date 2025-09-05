/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/* tslint:disable */
import React, { useState, useEffect, useCallback } from 'react';
import { ClassList } from './components/ParametersPanel'; // Repurposed ParametersPanel
import { AttendanceSheet } from './components/GeneratedContent'; // Repurposed GeneratedContent
import { ReportView } from './components/Icon'; // Repurposed Icon
import { Modal } from './components/Window'; // Repurposed Window
import { loadState, saveState } from './services/geminiService'; // Repurposed geminiService
import { Class, AttendanceData, DailyAttendance } from './types';

type View = 'CLASS_LIST' | 'ATTENDANCE_SHEET' | 'REPORT_VIEW';

const App: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [attendance, setAttendance] = useState<AttendanceData>({});
  const [currentView, setCurrentView] = useState<View>('CLASS_LIST');
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [classToEdit, setClassToEdit] = useState<Class | null>(null);
  const [classNameInput, setClassNameInput] = useState('');

  useEffect(() => {
    const { classes, attendance } = loadState();
    setClasses(classes);
    setAttendance(attendance);
  }, []);

  useEffect(() => {
    if (classes.length > 0) { // Avoid saving initial empty state
        saveState(classes, attendance);
    }
  }, [classes, attendance]);

  const handleSelectClass = (classId: string) => {
    setSelectedClassId(classId);
    setCurrentView('ATTENDANCE_SHEET');
  };

  const handleBackToClassList = () => {
    setSelectedClassId(null);
    setCurrentView('CLASS_LIST');
  };
  
  const handleViewReports = () => {
    setCurrentView('REPORT_VIEW');
  };
  
  const handleBackToAttendance = () => {
    setCurrentView('ATTENDANCE_SHEET');
  }

  const handleSaveAttendance = useCallback((date: string, dailyAttendance: DailyAttendance) => {
    if (!selectedClassId) return;
    setAttendance(prev => {
      const newAttendance = { ...prev };
      if (!newAttendance[selectedClassId]) {
        newAttendance[selectedClassId] = {};
      }
      newAttendance[selectedClassId][date] = dailyAttendance;
      return newAttendance;
    });
  }, [selectedClassId]);

  // Class CRUD handlers
  const openAddModal = () => {
    setModalMode('add');
    setClassNameInput('');
    setClassToEdit(null);
    setIsModalOpen(true);
  };
  
  const openEditModal = (classId: string) => {
    const cls = classes.find(c => c.id === classId);
    if (cls) {
      setModalMode('edit');
      setClassToEdit(cls);
      setClassNameInput(cls.name);
      setIsModalOpen(true);
    }
  };

  const handleDeleteClass = (classId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kelas ini? Semua data absensi akan hilang.')) {
      setClasses(prev => prev.filter(c => c.id !== classId));
      setAttendance(prev => {
        const newAtt = { ...prev };
        delete newAtt[classId];
        return newAtt;
      });
    }
  };

  const handleModalSave = () => {
    if (!classNameInput.trim()) {
        alert('Nama kelas tidak boleh kosong.');
        return;
    }
    if (modalMode === 'add') {
        const newClassId = `class-${Date.now()}`;
        const newStudents = Array.from({ length: 50 }, (_, i) => ({ id: `${newClassId}-student-${i + 1}`, name: `Siswa ${i + 1}` }));
        const newClass: Class = {
            id: newClassId,
            name: classNameInput.trim(),
            students: newStudents,
        };
        setClasses(prev => [...prev, newClass]);
    } else if (classToEdit) {
        setClasses(prev => prev.map(c => c.id === classToEdit.id ? { ...c, name: classNameInput.trim() } : c));
    }
    setIsModalOpen(false);
  };

  const selectedClass = classes.find(c => c.id === selectedClassId);
  const today = new Date().toISOString().split('T')[0];
  const initialAttendance = selectedClass ? attendance[selectedClass.id]?.[today] || {} : {};

  const renderContent = () => {
    switch (currentView) {
      case 'ATTENDANCE_SHEET':
        return selectedClass && <AttendanceSheet selectedClass={selectedClass} onSave={handleSaveAttendance} onBack={handleBackToClassList} onViewReports={handleViewReports} initialAttendance={initialAttendance} />;
      case 'REPORT_VIEW':
        return selectedClass && <ReportView selectedClass={selectedClass} attendanceData={attendance} onBack={handleBackToAttendance} />;
      case 'CLASS_LIST':
      default:
        return <ClassList classes={classes} onSelectClass={handleSelectClass} onAddClass={openAddModal} onEditClass={openEditModal} onDeleteClass={handleDeleteClass} />;
    }
  };

  return (
    <div className="bg-gray-100 w-full min-h-screen font-sans">
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {renderContent()}
        </main>
        <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'add' ? 'Tambah Kelas Baru' : 'Ubah Nama Kelas'}>
            <div className="space-y-4">
                <label htmlFor="className" className="block text-sm font-medium text-gray-700">Nama Kelas</label>
                <input
                    type="text"
                    id="className"
                    value={classNameInput}
                    onChange={(e) => setClassNameInput(e.target.value)}
                    className="app-input"
                    placeholder="Contoh: Kelas 10 J"
                />
                <div className="flex justify-end gap-2">
                    <button onClick={() => setIsModalOpen(false)} className="app-button-secondary">Batal</button>
                    <button onClick={handleModalSave} className="app-button">Simpan</button>
                </div>
            </div>
        </Modal>
    </div>
  );
};

export default App;
