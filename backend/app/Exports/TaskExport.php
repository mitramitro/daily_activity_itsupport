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
            'employee:id,nama',
            'office:id,name',
            'user:id,name'
        ]);

        // 🔒 Role-based access
        if (auth()->user()->role !== 'admin') {
            $query->where('user_id', auth()->id());
        }

        // 🔍 Search (multi keyword basic)
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

        // 📅 Date Range (core report filter)
        if ($this->request->filled('tanggal_dari') && $this->request->filled('tanggal_sampai')) {
            $query->whereBetween('tanggal', [
                $this->request->tanggal_dari,
                $this->request->tanggal_sampai
            ]);
        }

        return $query->latest()->get()->map(function ($task) {
            return [
                $task->tanggal,
                $task->kategori,
                $task->kendala,
                $task->solusi,
                ucfirst(str_replace('_', ' ', $task->status)),
                $task->employee?->nama,
                $task->office?->name,
                $task->user?->name, // 🔥 IT Support
            ];
        });
    }

    public function headings(): array
    {
        return [
            'Tanggal',
            'Kategori',
            'Kendala',
            'Solusi',
            'Status',
            'Pekerja',
            'Office',
            'IT Support',
        ];
    }



    public function startCell(): string
    {
        return 'A2'; // header mulai di baris 2
    }

    public function styles(Worksheet $sheet)
    {
        // 🔥 Judul
        $sheet->mergeCells('A1:H1');
        $sheet->setCellValue('A1', 'REPORT TASK IT SUPPORT');

        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14);
        $sheet->getStyle('A1')->getAlignment()->setHorizontal('center');

        // 🔥 Header
        $sheet->getStyle('A2:H2')->getFont()->setBold(true);

        // 🔥 Border semua cell
        $sheet->getStyle('A2:H100')->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => 'thin',
                ],
            ],
        ]);

        // 🔥 Alignment
        $sheet->getStyle('A2:A100')->getAlignment()->setHorizontal('center'); // tanggal
        $sheet->getStyle('D2:E100')->getAlignment()->setHorizontal('center'); // status

        return [];
    }
}
