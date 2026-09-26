---
title: History Stock Produk
status: draft
created: 2026-09-26
related: []
---

# History Stock Produk

## Ringkasan
Halaman baru "History Stok" di bawah menu Data Produk yang menampilkan riwayat setiap perubahan stok varian produk (tambah/kurang), supaya admin bisa melacak siapa, kapan, dan kenapa stok berubah.

## Latar Belakang / Masalah
Saat ini perubahan stok terjadi di 3 tempat berbeda: order dikonfirmasi mengurangi stok, order dibatalkan mengembalikan stok, dan edit manual lewat form produk/edit stok — tapi tidak ada log/riwayat sama sekali. Begitu stok berubah, nilai lama hilang tanpa jejak.

Ada percobaan fitur "history stok" sebelumnya (model `VariantStock`, `VariantStockRepository`, `VariantStockController`, page `Reporting/Item.jsx`), tapi tujuannya berbeda (mencatat stok masuk manual + estimasi stok terjual dari transaksi) dan route-nya sudah di-comment / nonaktif di `routes/web.php`. Fitur lama itu di luar scope task ini dan dibiarkan apa adanya.

## Tujuan
- Ada tabel/model baru `StockHistory` yang mencatat setiap perubahan stok varian: before_stock, after_stock, current_stock, user yang melakukan, action/alasan, dan timestamp.
- Pencatatan history otomatis lewat Model Observer di `Variant`, dipicu dari 3 skenario: order dikonfirmasi (`reduce_from_order`), order dibatalkan (`increase_from_order_cancel`), edit manual dari form produk/stok (`update_manual`).
- Halaman baru "History Stok" di menu PRODUK (di bawah "Data Produk") yang menampilkan tabel history dengan filter lengkap: SKU, nama produk, rentang tanggal, dan user yang mengubah.
- Permission baru khusus untuk halaman ini.

## Di Luar Scope
- Tidak menyentuh/mengaktifkan kembali fitur `VariantStock` + `Reporting/Item.jsx` yang sudah ada (tetap nonaktif, dibiarkan apa adanya).
- Tidak ada fitur tambah/edit/hapus manual dari halaman History Stok — murni read-only log.
- Tidak mengubah ulang mekanisme perhitungan stok (`Variant::total_stock()`) — hanya menambah logging di atas mekanisme yang sudah ada.
- Export Excel untuk history stok tidak termasuk di iterasi ini.

## Requirement / Behavior
- Given ada order yang statusnya diubah ke "diproses" (status 1), when stok varian dikurangi lewat `TransactionRepository::update()`, then tercatat 1 baris `StockHistory` dengan action `reduce_from_order`, `before_stock` = stok sebelum, `after_stock` = stok sesudah.
- Given ada order yang dibatalkan (status 5), when stok varian dikembalikan (increment), then tercatat 1 baris `StockHistory` dengan action `increase_from_order_cancel`.
- Given admin mengedit stok varian secara manual lewat form Edit Produk / Edit Stok, when stok tersimpan lewat `VariantRepository::store()`, then tercatat 1 baris `StockHistory` dengan action `update_manual`, `before_stock` = stok lama, `after_stock` = stok baru.
- Given stok variant tidak berubah (dirty check false), when variant disimpan (field lain berubah, misal nama/harga), then tidak ada baris `StockHistory` baru dibuat.
- Given admin membuka halaman "History Stok", when halaman dimuat, then tampil tabel berisi: nama produk, SKU, user, before_stock, after_stock, current_stock, tanggal/waktu perubahan, dan label action.
- Given admin mengisi filter SKU / nama produk / rentang tanggal / user, when submit filter, then tabel hanya menampilkan baris yang cocok dengan kombinasi filter tersebut (AND semua filter yang diisi).
- Given admin membuka dropdown "Kolom" dan mencentang/menghilangkan centang salah satu kolom (Produk, User, Before Stock, After Stock, Current Stock, Tanggal, Action), when perubahan disimpan, then kolom yang di-uncheck langsung hilang dari tabel dan preferensi itu tetap kepakai walau halaman di-refresh (disimpan di localStorage browser tsb).
- Given admin belum pernah mengatur visibilitas kolom (localStorage kosong), when halaman pertama kali dibuka, then semua kolom tampil default (tidak ada yang tersembunyi).

## Pendekatan Teknis
- Migration baru `create_stock_histories_table`: `uuid` (PK), `variant_uuid` (FK ke `variants`, nullOnDelete), `user_id` (FK ke `users`, nullable, nullOnDelete), `before_stock` (int), `after_stock` (int), `current_stock` (int), `action` (string), timestamps. Mengikuti pola migration `variant_stocks` yang sudah ada.
- Model `App\Models\StockHistory` — uuid sebagai primary key (pola project), fillable sesuai kolom, relasi `variant()` (belongsTo `Variant`) dan `user()` (belongsTo `User`).
- `App\Support\StockChangeContext` — static holder kecil (`set()` / `get()` / `clear()`) untuk membawa "alasan" perubahan stok ke Observer, karena Observer sendiri tidak tahu konteks pemanggilnya.
- `App\Observers\VariantObserver` — method `updating(Variant $variant)`: cek `$variant->isDirty('stock')`, kalau true buat 1 row `StockHistory` (`before_stock` = `getOriginal('stock')`, `after_stock` = stock baru, `current_stock` = after, `user_id` = `Auth::id()` jika ada, `action` = `StockChangeContext::get() ?? 'update_manual'`), lalu `StockChangeContext::clear()`. Register di `AppServiceProvider::boot()` via `Variant::observe(VariantObserver::class)`.
- Titik-titik yang perlu di-set context (1 baris tambahan tiap tempat):
  - `TransactionRepository::update()` sebelum `$variant->decrement('stock', ...)` pada blok `status == 1` → `StockChangeContext::set('reduce_from_order')`
  - `TransactionRepository::update()` sebelum `$variant->increment('stock', ...)` pada blok `status == 5` → `StockChangeContext::set('increase_from_order_cancel')`
  - `VariantRepository::store()` sebelum `updateOrCreate` → `StockChangeContext::set('update_manual')`
- Repository baru `App\Http\Repositories\StockHistoryRepository` — method `index_pagination(Request $request)` dengan filter: search SKU (`variant.sku`), search nama produk (`variant.product.name`), `user_id`/nama user (`whereHas('user', ...)`), `startDate`/`endDate` (`created_at` between). Pola query mengikuti `VariantStockRepository::index_pagination()`.
- Controller baru `App\Http\Controllers\Admin\StockHistoryController` — method `index()` saja (read-only), delegasi ke repository, `Inertia::render('Stok/History/Index', ...)`. Middleware `permission:stock-history-index` di constructor.
- Route baru di `routes/web.php`, grup `produk.` (konsisten dengan penempatan menu di sidebar): `Route::get('/history-stok', [StockHistoryController::class, 'index'])->name('history_stok.index');`
- Permission baru `stock-history-index` ditambahkan ke `database/seeders/UserSeeder.php` (mengikuti pola permission `product-*` yang sudah ada), pastikan role yang relevan (Admin/Superadmin) mendapat permission ini.
- Sidebar: tambah entry baru di grup `PRODUK` pada `resources/js/Components/Sidebar/Sidebar.jsx`, guard `permissions.includes("stock-history-index")`, url `/produk/history-stok`, text "History Stok".
- Frontend page baru `resources/js/Pages/Stok/History/Index.jsx` — mengikuti pola desain halaman list yang sudah ada (`DefaultLayout`, header + search cepat + tombol filter, card putih rounded berisi tabel, `PaginationDashboard`), tanpa tombol "Tambah" dan tanpa checkbox bulk-select karena halaman ini read-only (murni log, tidak ada CRUD dari sini). Contoh acuan layout: `resources/js/Pages/Category/Index.jsx` (struktur tabel) + `resources/js/Pages/Reporting/Item.jsx` (kolom produk+sku, format tanggal).
  - Kolom tabel: No, Produk (nama + SKU kecil di bawahnya), User, Before Stock, After Stock, Current Stock, Tanggal (`moment(...).format("DD/MM/YYYY, HH:mm")`), Action (label teks dari mapping: `reduce_from_order` → "Reduce from Order", `increase_from_order_cancel` → "Increase from Order Cancel", `update_manual` → "Update Manual").
  - Search box di header: quick search nama produk/SKU (param `search`, konsisten dengan pola semua halaman index lain).
  - Modal filter baru `resources/js/Components/Modal/StockHistory/ModalFilterStockHistory.jsx` (clone dari `resources/js/Components/Modal/Penjualan/ModalFilter.jsx`), isi: date range (`Datepicker`), input SKU, input Nama Produk, select User — dikirim sebagai query param (`sku`, `product`, `startDate`, `endDate`, `user_id`) lewat `router.get(...)` pola yang sama seperti `handleApplyFilter` di `Reporting/Item.jsx`.
  - Toggle visibilitas kolom: tombol/dropdown "Kolom" di sebelah tombol filter (pola dropdown sama seperti `dropdownOpen`/`toggleDropdown` yang sudah dipakai di `Reporting/Item.jsx`), isi checklist untuk tiap kolom yang bisa disembunyikan (Produk selalu tampil karena jadi identitas baris; User, Before Stock, After Stock, Current Stock, Tanggal, Action bisa di-toggle). State visibilitas disimpan di `localStorage` (key `stock_history_visible_columns`) lewat custom hook kecil, murni client-side, tidak perlu endpoint/kolom baru di backend. Kolom yang di-uncheck disembunyikan dari `<thead>` dan `<tbody>` sekaligus (render kondisional per kolom).

## Rencana Eksekusi
- [ ] Buat migration `create_stock_histories_table`
- [ ] Buat model `StockHistory` (uuid PK, fillable, relasi `variant()` & `user()`)
- [ ] Buat `App\Support\StockChangeContext` (set/get/clear)
- [ ] Buat `App\Observers\VariantObserver` dan register di `AppServiceProvider::boot()`
- [ ] Set `StockChangeContext` di `TransactionRepository::update()` (2 titik: reduce saat status 1, increase saat status 5)
- [ ] Set `StockChangeContext` di `VariantRepository::store()` sebelum `updateOrCreate`
- [ ] Buat `StockHistoryRepository` dengan `index_pagination()` + filter sku/nama/tanggal/user
- [ ] Buat `StockHistoryController` (index only) + middleware permission
- [ ] Tambah route `produk.history_stok.index` di `routes/web.php`
- [ ] Tambah permission `stock-history-index` ke `UserSeeder.php`, jalankan seeder ulang di lokal
- [ ] Tambah entry sidebar "History Stok" di grup PRODUK
- [ ] Buat halaman React `Stok/History/Index.jsx` (tabel + filter + pagination, mengikuti pola `Reporting/Item.jsx`)
- [ ] Tambah dropdown "Kolom" (toggle visibilitas kolom) + persist state ke localStorage
- [ ] Manual test 3 skenario (reduce order, increase cancel, update manual) + test filter kombinasi di browser
- [ ] Manual test toggle kolom (uncheck/check, refresh halaman, pastikan preferensi tetap kepakai)

## Test Plan / Acceptance Criteria
- Ubah status order jadi "diproses" (1) dari halaman Pesanan → cek baris baru muncul di History Stok dengan action "Reduce from Order", before/after sesuai qty order.
- Batalkan order yang sudah dikonfirmasi (status 5) → cek baris baru "Increase from Order Cancel".
- Edit stok manual lewat form Edit Produk/Edit Stok → cek baris baru "Update Manual" dengan before/after sesuai input.
- Edit produk tanpa mengubah field stok (misal cuma ganti nama) → pastikan TIDAK ada baris history baru dibuat.
- Uji filter SKU, nama produk, rentang tanggal, dan user satu per satu maupun kombinasi → hasil tabel sesuai kombinasi filter.
- Pastikan menu "History Stok" hanya muncul untuk user/role yang punya permission `stock-history-index`.
- Uncheck beberapa kolom lewat dropdown "Kolom" → kolom langsung hilang dari tabel; refresh halaman → kolom yang di-uncheck tetap tersembunyi (localStorage jalan).

## Open Questions
- Kalau order berisi banyak variant sekaligus, tiap variant diasumsikan dapat 1 baris history terpisah (karena loop per item) — konfirmasi kalau ada ekspektasi lain.
- Format label kolom "Action" di UI: draft pakai label Inggris apa adanya ("Reduce from Order", dst) sesuai contoh yang diberikan — konfirmasi kalau perlu diterjemahkan ke Bahasa Indonesia.
