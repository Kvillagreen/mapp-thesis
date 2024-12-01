<?php
include 'connection.php'; // Assumes this file initializes $conn
// Get POST data
$data = json_decode(file_get_contents("php://input"), true);

// To get non-file form fields (like userId, eventId, kioskId, etc.)
$userId = $_POST['userId'] ?? '';
$eventId = $_POST['eventId'] ?? '';
$kioskId = $_POST['kioskId'] ?? '';
$dateRequested = $_POST['dateRequested'] ?? '';
$purpose = $_POST['purpose'] ?? '';
$loi = $_FILES['loi'] ?? '';  // Get uploaded file 'loi'
$status = 'pending';
$kioskStatus = 'unavailable';

// Check required fields
if (!$userId || !$eventId || !$kioskId || !$dateRequested || !$purpose) {
    echo json_encode([
        'success' => false,
        'message' => 'error in missing filed'
    ]);
    exit();
}
// Validate foreign key relationships
function recordExists($conn, $table, $column, $value)
{
    $exists = '';
    $query = $conn->prepare("SELECT COUNT(*) FROM `$table` WHERE `$column` = ?");
    $query->bind_param("s", $value);
    $query->execute();
    $query->bind_result($exists); // Ensure this variable is bound properly
    $query->fetch(); // Fetch the result

    // Check if record exists (1 or more rows) or not (0 rows)
    $query->close();
    return $exists > 0;
}

if (!recordExists($conn, 'tbl_event', 'event_id', $eventId)) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid event ID. The event does not exist.'
    ]);
    exit();
}

if (!recordExists($conn, 'tbl_kiosk', 'kiosk_id', $kioskId)) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid kiosk ID. The kiosk does not exist.'
    ]);
    exit();
}

// File upload handling
$filePath = '';
if ($loi) {
    $allowedTypes = ['application/pdf'];
    $fileTmpPath = $loi['tmp_name'];
    $fileName = uniqid() . '_' . basename($loi['name']); // Unique file name
    $fileSize = $loi['size'];
    $fileType = $loi['type'];

    if (!in_array($fileType, $allowedTypes)) {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid file type. Only PDF files are allowed.'
        ]);
        exit();
    }

    if ($fileSize > 5000000) { // Max file size 5MB
        echo json_encode([
            'success' => false,
            'message' => 'File size exceeds the limit of 5MB.'
        ]);
        exit();
    }

    // Define the upload directory
    $uploadDir = '../../../../public/dbAssets/userImages/';
    $filePath = $uploadDir . $fileName;

    if (!move_uploaded_file($fileTmpPath, $filePath)) {
        echo json_encode([
            'success' => false,
            'message' => 'There was an error uploading the file. Please try again later.'
        ]);
        exit();
    }
}

// Insert and update database
$insertQuery = $conn->prepare(
    "INSERT INTO `tbl_transactions` 
    (`user_id`, `event_id`, `kiosk_id`, `date_req`, `purpose`, `file_name`, `status`, `date_created`) 
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW())"
);
$updateQuery = $conn->prepare(
    "UPDATE `tbl_kiosk` 
    SET `status` = ? 
    WHERE `kiosk_id` = ? AND `event_id` = ?"
);

$insertQuery->bind_param("sssssss", $userId, $eventId, $kioskId, $dateRequested, $purpose, $fileName, $status);
$updateQuery->bind_param('sis', $kioskStatus, $kioskId, $eventId);

if ($insertQuery->execute() && $updateQuery->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Application successful.'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'There was an error submitting information.',
        'error' => $conn->error
    ]);
}

// Close database connection
$conn->close();
?>