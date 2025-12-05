<?php

namespace App\Imports;
use App\Http\Repositories\ProductRepository;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithStartRow;

class ProductImport implements ToModel, WithHeadingRow, WithStartRow
{
    protected $productRepository;
    protected $currentRow = 1; // urutan mulai dari baris 2 (header)

    public function __construct(ProductRepository $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    public function startRow(): int
    {
        return 2; // anggap row 1 header
    }

    public function model(array $row)
    {
        // tambahkan posisi dari Excel
        $row['position'] = $this->currentRow++;

        $this->productRepository->import($row);
    }
}
