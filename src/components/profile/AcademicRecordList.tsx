import { useState } from 'react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { ConfirmDelete } from '../common/ConfirmDelete';
import { EmptyState } from '../common/EmptyState';
import type { AcademicRecord, Id, Subject } from '../../types/profile';

interface AcademicRecordListProps {
  records: AcademicRecord[];
  subjects: Subject[];
  onEdit: (record: AcademicRecord) => void;
  onDelete: (id: Id) => Promise<void>;
}

interface Group {
  key: string;
  grade: number;
  semester: number;
  items: AcademicRecord[];
}

function groupRecords(records: AcademicRecord[]): Group[] {
  const map = new Map<string, Group>();
  for (const record of records) {
    const key = `${record.grade}-${record.semester}`;
    const group = map.get(key) ?? { key, grade: record.grade, semester: record.semester, items: [] };
    group.items.push(record);
    map.set(key, group);
  }
  return [...map.values()].sort((a, b) => a.grade - b.grade || a.semester - b.semester);
}

export function AcademicRecordList({ records, subjects, onEdit, onDelete }: AcademicRecordListProps) {
  const [deletingId, setDeletingId] = useState<Id | null>(null);

  if (records.length === 0) {
    return (
      <EmptyState
        title="Belum ada nilai"
        description="Tambahkan nilai rapor lewat formulir di atas. Nilai dipakai untuk menghitung peluang diterima."
      />
    );
  }

  const nameOf = (record: AcademicRecord): string =>
    record.subject_name ?? subjects.find((s) => String(s.id) === String(record.subject_id))?.name ?? 'Mata pelajaran';

  return (
    <div className="space-y-6">
      {groupRecords(records).map((group) => (
        <Card key={group.key} flush>
          <h3 className="border-b border-line px-6 py-4 text-base font-semibold text-ink sm:px-8">
            Kelas {group.grade}, Semester {group.semester}
          </h3>
          <ul>
            {group.items.map((record) => {
              const name = nameOf(record);
              return (
                <li
                  key={String(record.id)}
                  className="flex flex-col gap-3 border-b border-line px-6 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:px-8"
                >
                  <div className="flex items-baseline justify-between gap-4 sm:justify-start sm:gap-6">
                    <span className="text-base text-ink">{name}</span>
                    <span className="text-base font-bold text-link">{record.score}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      className="h-9 px-3"
                      onClick={() => onEdit(record)}
                      aria-label={`Ubah nilai ${name} kelas ${record.grade} semester ${record.semester}`}
                    >
                      Ubah
                    </Button>
                    <ConfirmDelete
                      subject={`nilai ${name} kelas ${record.grade} semester ${record.semester}`}
                      busy={deletingId === record.id}
                      onConfirm={async () => {
                        setDeletingId(record.id);
                        try {
                          await onDelete(record.id);
                        } finally {
                          setDeletingId(null);
                        }
                      }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      ))}
    </div>
  );
}
