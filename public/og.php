<?php
/**
 * OG meta renderer untuk SIMAIK (webapp-link-previews).
 *
 * Crawler link preview (WhatsApp/Telegram/Facebook) tidak menjalankan JavaScript,
 * sehingga SPA hanya memperlihatkan <title> generik. Skrip ini menyuntikkan
 * <title> + meta Open Graph per halaman ke dalam shell SPA (index.html) berdasarkan
 * URL yang diminta. Manusia mendapatkan shell yang sama + meta yang tidak berbahaya.
 *
 * Dipakai via rewrite server (lihat .htaccess / config nginx) untuk path publik:
 *   /unduh-sertifikat/:kode/:slug?   /daftar-peserta/:kode/:slug?
 *   /formulir/:kode/:peran/...       /kegiatan/:kode/:slug?
 *   /evaluasi/:kode/...              /laporan-evaluasi/:kode/...
 *   /test/:kode/...
 * Path lain tidak menyentuh skrip ini.
 */

declare(strict_types=1);

const OG_CACHE_TTL = 900; // 15 menit

$uri   = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$host  = $_SERVER['HTTP_HOST'] ?? 'localhost';
$proto = 'https';
if (!empty($_SERVER['HTTP_X_FORWARDED_PROTO'])) {
    $proto = strtolower(trim(explode(',', $_SERVER['HTTP_X_FORWARDED_PROTO'])[0]));
    if ($proto !== 'http' && $proto !== 'https') $proto = 'https';
}
$base = $proto . '://' . $host;

/** slug -> judul manusiawi (fallback saat lookup API gagal) */
function og_unslugify(?string $slug): string
{
    $s = trim((string) $slug);
    if ($s === '') return '';
    $s = str_replace(['-', '_'], ' ', $s);
    $s = preg_replace('/\s+/', ' ', $s) ?? $s;
    return ucwords(strtolower($s));
}

/** lookup nama kegiatan via API publik host yang sama, dengan cache file */
function og_nama_kegiatan(string $base, string $kode): ?string
{
    if (!preg_match('/^[A-Za-z0-9_-]+$/', $kode)) return null;
    $dir = rtrim(sys_get_temp_dir(), '/') . '/simaik-og-cache';
    if (!is_dir($dir)) @mkdir($dir, 0755, true);
    $cacheFile = $dir . '/' . md5($base . '|' . $kode) . '.json';
    if (is_file($cacheFile) && (time() - (int) filemtime($cacheFile)) < OG_CACHE_TTL) {
        $cached = json_decode((string) file_get_contents($cacheFile), true);
        if (is_array($cached)) return $cached['nama'] ?? null;
    }
    $nama = null;
    $ctx = stream_context_create([
        'http' => [
            'method' => 'GET',
            'timeout' => 5,
            'ignore_errors' => true,
            'header' => "Accept: application/json\r\nUser-Agent: SIMAIK-OG-Renderer\r\n",
        ],
    ]);
    $raw = @file_get_contents($base . '/api/v1/kegiatan/' . urlencode($kode), false, $ctx);
    if ($raw !== false) {
        $json = json_decode($raw, true);
        $candidate = $json['data']['nama_kegiatan'] ?? $json['nama_kegiatan'] ?? null;
        if (is_string($candidate) && trim($candidate) !== '') $nama = trim($candidate);
    }
    @file_put_contents($cacheFile, json_encode(['nama' => $nama]), LOCK_EX);
    return $nama;
}

// ---- Kenali halaman dari URL ----
$parts = array_values(array_filter(explode('/', $uri), static fn ($p) => $p !== ''));
$pageLabel = null;
$peran = null;
$kode = null;
$slug = null;
if (count($parts) >= 2) {
    $seg0 = $parts[0];
    $kode = $parts[1];
    $last = $parts[count($parts) - 1];
    if ($seg0 === 'formulir') {
        $peran = $parts[2] ?? 'Peserta';
        $pageLabel = 'Formulir ' . ucfirst(strtolower($peran));
        // /formulir/:kode/:peran/:slug  atau  /formulir/:kode/:peran/:idTpk/:slug
        $slug = count($parts) >= 5 ? $last : ($parts[3] ?? null);
    } else {
        $map = [
            'unduh-sertifikat'   => 'Unduh Sertifikat',
            'daftar-peserta'     => 'Daftar Peserta',
            'kegiatan'           => 'Detail Kegiatan',
            'evaluasi'           => 'Evaluasi Kegiatan',
            'laporan-evaluasi'   => 'Laporan Evaluasi Kegiatan',
            'test'               => 'Ujian Online',
        ];
        if (isset($map[$seg0])) {
            $pageLabel = $map[$seg0];
            // :kode/:slug? atau :kode/:idTpk/:slug? — slug = segmen terakhir bila bukan angka
            $slug = is_numeric($last) ? null : $last;
        }
    }
}

// ---- Susun judul & deskripsi ----
$nama = ($kode !== null && $pageLabel !== null) ? og_nama_kegiatan($base, $kode) : null;
if ($nama === null || $nama === '') $nama = og_unslugify($slug);

$defaultTitle = 'SIMAIK - Sistem Informasi Administrasi Manajemen Kegiatan';
$defaultDesc  = 'Sistem Informasi Administrasi Manajemen Kegiatan BPMP Provinsi Nusa Tenggara Barat.';

if ($pageLabel !== null && $nama !== '') {
    $title = $pageLabel . ' - ' . $nama;
    $descriptions = [
        'Unduh Sertifikat'           => 'Unduh sertifikat peserta kegiatan ' . $nama . '.',
        'Daftar Peserta'             => 'Daftar peserta kegiatan ' . $nama . '.',
        'Detail Kegiatan'            => 'Informasi detail kegiatan ' . $nama . '.',
        'Evaluasi Kegiatan'          => 'Formulir evaluasi kegiatan ' . $nama . '.',
        'Laporan Evaluasi Kegiatan'  => 'Laporan dan statistik hasil evaluasi kegiatan ' . $nama . '.',
        'Ujian Online'               => 'Kerjakan soal ujian kegiatan ' . $nama . '.',
    ];
    $description = $descriptions[$pageLabel] ?? ('Formulir pendaftaran kegiatan ' . $nama . '.');
} elseif ($pageLabel !== null) {
    $title = $pageLabel . ' - Kegiatan';
    $description = $defaultDesc;
} else {
    $title = $defaultTitle;
    $description = $defaultDesc;
}

$ogImage = $base . '/og-default.png';
$ogUrl   = $base . $uri;

// ---- Suntikkan ke shell SPA ----
$shellFile = __DIR__ . '/index.html';
$shell = @file_get_contents($shellFile);
if ($shell === false) {
    http_response_code(500);
    header('Content-Type: text/plain; charset=utf-8');
    echo 'Shell aplikasi tidak ditemukan.';
    exit;
}

$h = static fn (string $s): string => htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

$meta = '<meta property="og:site_name" content="SIMAIK">' . "\n"
      . '<meta property="og:type" content="website">' . "\n"
      . '<meta property="og:title" content="' . $h($title) . '">' . "\n"
      . '<meta property="og:description" content="' . $h($description) . '">' . "\n"
      . '<meta property="og:url" content="' . $h($ogUrl) . '">' . "\n"
      . '<meta property="og:image" content="' . $h($ogImage) . '">' . "\n"
      . '<meta property="og:locale" content="id_ID">' . "\n"
      . '<meta name="twitter:card" content="summary_large_image">' . "\n"
      . '<meta name="twitter:title" content="' . $h($title) . '">' . "\n"
      . '<meta name="twitter:description" content="' . $h($description) . '">' . "\n"
      . '<meta name="twitter:image" content="' . $h($ogImage) . '">';

// Ganti <title> (pertama yang cocok) dan deskripsi; sisipkan blok meta sebelum </head>.
$shell = (string) preg_replace('/<title>.*?<\/title>/is', '<title>' . $h($title) . '</title>', $shell, 1);
if (stripos($shell, 'name="description"') !== false) {
    $shell = (string) preg_replace('/<meta[^>]*name="description"[^>]*>/i', '<meta name="description" content="' . $h($description) . '">', $shell, 1);
} else {
    $shell = (string) preg_replace('/<\/head>/i', '<meta name="description" content="' . $h($description) . '">' . "\n" . '</head>', $shell, 1);
}
$shell = (string) preg_replace('/<\/head>/i', $meta . "\n" . '</head>', $shell, 1);

header('Content-Type: text/html; charset=utf-8');
echo $shell;
