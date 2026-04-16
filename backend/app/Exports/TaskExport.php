<?php

namespace App\Exports;

use App\Models\Task;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithCustomStartCell;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class TaskExport implements FromCollection, WithHeadings, WithStyles, WithCustomStartCell, ShouldAutoSize
{
    protected $request;

    public function __construct($request)
    {
        $this->request = $request;
    }

    public function collection()
    {
        $query = Task::with([
            'employee:id,nama,nomor_pekerja,email,jabatan',
            'office:id,name',
            'user:id,name,email',
            'photos:id,task_id,photo'
        ]);

        // 🔒 Role-based access
        if (auth()->user()->role !== 'admin') {
            $query->where('user_id', auth()->id());
        }

        // 🔍 Search
        if ($this->request->filled('search')) {
            $query->where('kendala', 'like', '%' . $this->request->search . '%');
        }

        // 🎯 Status
        if ($this->request->filled('status')) {
            $query->where('status', $this->request->status);
        }

        // 🎯 Jenis Task
        if ($this->request->filled('jenis_task')) {
            $query->where('jenis_task', $this->request->jenis_task);
        }

        // 📅 Date Range
        if ($this->request->filled('tanggal_dari') && $this->request->filled('tanggal_sampai')) {
            $query->whereBetween('tanggal', [
                $this->request->tanggal_dari,
                $this->request->tanggal_sampai
            ]);
        }

        return $query->latest()->get()->values()->map(function ($task, $index) {

            // 🔥 Multi foto → 1 cell
            $photos = $task->photos->map(function ($p) {
                return asset('storage/' . $p->photo);
            })->implode("\n");

            return [
                $index + 1,

                optional($task->created_at)->format('Y-m-d H:i:s'),

                $task->user?->name ?? '-',
                $task->user?->email ?? '-',

                $task->employee?->nama ?? '-',
                $task->employee?->nomor_pekerja ?? '-',
                $task->employee?->email ?? '-',
                $task->employee?->jabatan ?? '-',

                $task->office?->name ?? '-',

                $task->tanggal ?? '-',

                $task->kategori ?? '-',

                $task->kendala ?? '-',

                $task->solusi ?? '-',

                $task->status
                    ? ucfirst(str_replace('_', ' ', $task->status))
                    : '-',

                $photos ?: '-',
            ];
        });
    }

    public function headings(): array
    {
        return [
            'No',
            'Tanggal Dibuat',
            'Nama IT Support',
            'Email IT Support',
            'Nama Pekerja',
            'Nomor Pegawai',
            'Email Pegawai',
            'Jabatan',
            'Office',
            'Tanggal Kejadian',
            'Kategori',
            'Kendala',
            'Solusi',
            'Status',
            'Foto',
        ];
    }

    public function startCell(): string
    {
        return 'A2';
    }

    public function styles(Worksheet $sheet)
    {
        // 🔥 Judul
        $sheet->mergeCells('A1:O1');
        $sheet->setCellValue('A1', 'REPORT TASK IT SUPPORT');

        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14);
        $sheet->getStyle('A1')->getAlignment()->setHorizontal('center');

        // 🔥 Header
        $sheet->getStyle('A2:O2')->getFont()->setBold(true);

        // 🔥 Border
        $sheet->getStyle('A2:O100')->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => 'thin',
                ],
            ],
        ]);

        // 🔥 Alignment
        $sheet->getStyle('A2:A100')->getAlignment()->setHorizontal('center'); // No
        $sheet->getStyle('B2:B100')->getAlignment()->setHorizontal('center'); // Created At
        $sheet->getStyle('J2:J100')->getAlignment()->setHorizontal('center'); // Tanggal Kejadian
        $sheet->getStyle('N2:N100')->getAlignment()->setHorizontal('center'); // Status

        // 🔥 Wrap text
        $sheet->getStyle('L2:L100')->getAlignment()->setWrapText(true); // Kendala
        $sheet->getStyle('M2:M100')->getAlignment()->setWrapText(true); // Solusi
        $sheet->getStyle('O2:O100')->getAlignment()->setWrapText(true); // Foto

        return [];
    }
}
