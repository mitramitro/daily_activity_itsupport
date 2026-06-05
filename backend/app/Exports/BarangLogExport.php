<?php

namespace App\Exports;

use App\Models\BarangLog;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithCustomStartCell;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class BarangLogExport implements FromCollection, WithHeadings, WithStyles, WithCustomStartCell, ShouldAutoSize
{
    protected $request;

    public function __construct($request)
    {
        $this->request = $request;
    }

    public function collection()
    {
        $query = BarangLog::with([
            'barang:id,name',
            'fromEmployee:id,nama',
            'toEmployee:id,nama',
            'fromOffice:id,name',
            'toOffice:id,name',
        ]);

        if ($this->request->filled('search')) {
            $s = $this->request->search;
            $query->where(function ($q) use ($s) {
                $q->whereHas('barang', fn($q2) => $q2->where('name', 'like', "%{$s}%"))
                    ->orWhereHas('fromEmployee', fn($q2) => $q2->where('nama', 'like', "%{$s}%"))
                    ->orWhereHas('toEmployee', fn($q2) => $q2->where('nama', 'like', "%{$s}%"))
                    ->orWhere('type', 'like', "%{$s}%");
            });
        }

        if ($this->request->filled('type')) {
            $query->where('type', $this->request->type);
        }

        if ($this->request->filled('office_id')) {
            $query->where(function ($q) {
                $q->where('from_office_id', $this->request->office_id)
                    ->orWhere('to_office_id', $this->request->office_id);
            });
        }

        if ($this->request->filled('tanggal_dari') && $this->request->filled('tanggal_sampai')) {
            $query->whereBetween('tanggal', [
                $this->request->tanggal_dari,
                $this->request->tanggal_sampai
            ]);
        }

        return $query->orderByDesc('tanggal')->orderByDesc('id')->get()->values()->map(function ($log, $index) {
            return [
                $index + 1,
                $log->barang?->name ?? '-',
                $log->type,
                $log->fromEmployee?->nama ?? '-',
                $log->fromOffice?->name ?? '-',
                $log->toEmployee?->nama ?? '-',
                $log->toOffice?->name ?? '-',
                $log->qty,
                $log->condition ?? '-',
                $log->tanggal ? \Carbon\Carbon::parse($log->tanggal)->format('Y-m-d') : '-',
                $log->notes ?? '-',
            ];
        });
    }

    public function headings(): array
    {
        return [
            'No',
            'Nama Barang',
            'Tipe',
            'Dari Employee',
            'Dari Office',
            'Ke Employee',
            'Ke Office',
            'Qty',
            'Kondisi',
            'Tanggal',
            'Keterangan',
        ];
    }

    public function startCell(): string
    {
        return 'A2';
    }

    public function styles(Worksheet $sheet)
    {
        $lastColumn = 'K';
        $lastRow = 100;

        $sheet->mergeCells("A1:{$lastColumn}1");
        $sheet->setCellValue('A1', 'REPORT INVENTORY (BARANG MASUK / KELUAR)');
        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14);
        $sheet->getStyle('A1')->getAlignment()->setHorizontal('center');

        $sheet->getStyle("A2:{$lastColumn}2")->getFont()->setBold(true);

        $sheet->getStyle("A2:{$lastColumn}{$lastRow}")->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => 'thin',
                ],
            ],
        ]);

        $sheet->getStyle("A2:A{$lastRow}")->getAlignment()->setHorizontal('center');
        $sheet->getStyle("C2:C{$lastRow}")->getAlignment()->setHorizontal('center');
        $sheet->getStyle("H2:H{$lastRow}")->getAlignment()->setHorizontal('center');
        $sheet->getStyle("J2:J{$lastRow}")->getAlignment()->setHorizontal('center');

        return [];
    }
}
