<?php
// php/start_campaign.php
// Simple handling: simpan file upload dan catat di DB
$host = '127.0.0.1';
$db   = 'pedulikanker';
$user = 'root';
$pass = '';
$dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";

try {
    $pdo = new PDO($dsn, $user, $pass, [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
} catch (Exception $e) {
    echo "DB connection error";
    exit;
}

$nama = $_POST['nama_pasien'] ?? '';
$judul = $_POST['judul_kampanye'] ?? '';
$deskripsi = $_POST['deskripsi'] ?? '';
$target = intval($_POST['target_dana'] ?? 0);

// handling upload sederhana
$uploadDir = __DIR__ . '/../uploads/';
if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

$mediaPath = '';
if (isset($_FILES['file_media']) && $_FILES['file_media']['error'] === UPLOAD_ERR_OK){
    $tmp = $_FILES['file_media']['tmp_name'];
    $name = basename($_FILES['file_media']['name']);
    $dest = $uploadDir . time() . '_' . $name;
    move_uploaded_file($tmp, $dest);
    $mediaPath = 'uploads/' . basename($dest);
}

$docPath = '';
if (isset($_FILES['dokumen_medis']) && $_FILES['dokumen_medis']['error'] === UPLOAD_ERR_OK){
    $tmp = $_FILES['dokumen_medis']['tmp_name'];
    $name = basename($_FILES['dokumen_medis']['name']);
    $dest = $uploadDir . time() . '_' . $name;
    move_uploaded_file($tmp, $dest);
    $docPath = 'uploads/' . basename($dest);
}

try {
    $stmt = $pdo->prepare("INSERT INTO campaigns (title, patient_name, description, target, collected, media, document, created_at, verified) VALUES (?, ?, ?, ?, 0, ?, ?, NOW(), 0)");
    $stmt->execute([$judul, $nama, $deskripsi, $target, $mediaPath, $docPath]);

    echo "Pengajuan berhasil. Tim kami akan memverifikasi.";
} catch (Exception $e){
    echo "Gagal menyimpan: " . $e->getMessage();
}
