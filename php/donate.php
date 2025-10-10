<?php
// php/donate.php
header('Content-Type: application/json');

// konfigurasi DB
$host = '127.0.0.1';
$db   = 'pedulikanker';
$user = 'root';
$pass = '';
$dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";

try {
    $pdo = new PDO($dsn, $user, $pass, [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION]);
} catch (Exception $e) {
    echo json_encode(['success'=>false, 'message'=>'DB connection error']);
    exit;
}

$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$amount = intval($_POST['amount'] ?? 0);
$message = $_POST['message'] ?? '';
$campaign_id = intval($_POST['campaign_id'] ?? 0);
$method = $_POST['method'] ?? 'QR';

if (!$name || !$email || !$amount || !$campaign_id) {
    echo json_encode(['success'=>false, 'message'=>'Missing fields']);
    exit;
}

try {
    // simpan ke tabel donations
    $stmt = $pdo->prepare("INSERT INTO donations (campaign_id, donor_name, donor_email, amount, method, message, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())");
    $stmt->execute([$campaign_id, $name, $email, $amount, $method, $message]);

    // update collected kolom campaigns
    $stmt2 = $pdo->prepare("UPDATE campaigns SET collected = collected + ? WHERE id = ?");
    $stmt2->execute([$amount, $campaign_id]);

    echo json_encode(['success'=>true, 'message'=>'Donasi diterima']);
} catch (Exception $e){
    echo json_encode(['success'=>false, 'message'=>$e->getMessage()]);
}
