<?php
include 'connection.php'; // Assumes this file initializes $conn


// Get POST data
$data = json_decode(file_get_contents("php://input"), true);

// Retrieve non-file form fields
$userId = $_POST['userId'] ?? '';
$eventId = $_POST['eventId'] ?? '';
$kioskId = $_POST['kioskId'] ?? '';
$userName = $_POST['userName'] ?? '';
$kioskName = $_POST['kioskName'] ?? '';
$purpose = $_POST['purpose'] ?? '';
$requirements = $_POST['requirements'] ?? '';
$rentDate = $_POST['rentDate'] ?? '';
$loi = $_FILES['loi'] ?? ''; // Get uploaded file 'loi'
$businessPermit = $_FILES['businessPermit']?? null ; // Get uploaded file 'businessPermit'
$mayorsPermit = $_FILES['mayorsPermit']?? null   ; // Get uploaded file 'mayorsPermit'
$sanitaryPermit = $_FILES['sanitaryPermit']?? null  ; // Get uploaded file 'sanitaryPermit'
$status = 'pending';
$kioskStatus = 'pending';

// Check required fields
if (!$userId || !$eventId || !$kioskId || !$purpose ||!$rentDate ) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: Missing required fields.'
    ]);
    exit();
}

// Function to validate foreign key relationships
function recordExists($conn, $table, $column, $value)
{
    $exists = '';
    $query = $conn->prepare("SELECT COUNT(*) FROM `$table` WHERE `$column` = ?");
    $query->bind_param("s", $value);
    $query->execute();
    $query->bind_result($exists);
    $query->fetch();
    $query->close();
    return $exists > 0;
}

// Validate event ID
if (!recordExists($conn, 'tbl_event', 'event_id', $eventId)) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid event ID. The event does not exist.'
    ]);
    exit();
}

// Validate kiosk ID
if (!recordExists($conn, 'tbl_kiosk', 'kiosk_id', $kioskId)) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid kiosk ID. The kiosk does not exist.'
    ]);
    exit();
}

// File upload handling
// File upload handling
$filePath = '';
if ($loi) {
    $allowedTypes = ['application/pdf'];
    $fileTmpPath = $loi['tmp_name'];
    $fileType = $loi['type'];
    $fileName = $loi['name']; // Unique file name
    $fileName = uniqid('application', true) . '.' . pathinfo($fileName, PATHINFO_EXTENSION);
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
    $uploadDir = '../../public/dbAssets/userImages/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $filePath = $uploadDir . $fileName;

    if (!move_uploaded_file($fileTmpPath, $filePath)) {
        echo json_encode([
            'success' => false,
            'message' => 'There was an error uploading the file. Please try again later.'
        ]);
        exit();
    }
}


$uploadDirs = '../../public/dbAssets/requirementsImages/';
// Optional file handling
$mayorsPermitName = '';
if ($mayorsPermit) {
    $allowedTypes = ['application/pdf'];
    $fileTmpPath = $mayorsPermit['tmp_name'];
    $fileNameMayorsName = $mayorsPermit['name']; // Unique file name
    $fileNameMayorsName = uniqid('application', true) . '.' . pathinfo($fileNameMayorsName, PATHINFO_EXTENSION);
    if (!is_dir($uploadDirs)) {
        mkdir($uploadDir, 0777, true);
    }

    $filePath = $uploadDirs . $fileNameMayorsName;

    if (!move_uploaded_file($fileTmpPath, $filePath)) {
        echo json_encode([
            'success' => false,
            'message' => 'There was an error uploading the mayor\'s permit file.'
        ]);
        exit();
    }

    $mayorsPermitName = $fileNameMayorsName;
}

$businessPermitName = '';
if ($businessPermit) {
    $allowedTypes = ['application/pdf'];
    $fileTmpPath = $businessPermit['tmp_name'];
    $businessPermitName = $businessPermit['name']; // Unique file name
    $businessPermitName = uniqid('application', true) . '.' . pathinfo($businessPermitName, PATHINFO_EXTENSION);
    if (!is_dir($uploadDirs)) {
        mkdir($uploadDir, 0777, true);
    }

    $filePath = $uploadDirs . $businessPermitName;

    if (!move_uploaded_file($fileTmpPath, $filePath)) {
        echo json_encode([
            'success' => false,
            'message' => 'There was an error uploading the business permit file.'
        ]);
        exit();
    }
}

$sanitaryPermitName = '';
if ($sanitaryPermit) {
    $allowedTypes = ['application/pdf'];
    $fileTmpPath = $sanitaryPermit['tmp_name'];
    $sanitaryPermitName = $sanitaryPermit['name']; // Unique file name
    $sanitaryPermitName = uniqid('application', true) . '.' . pathinfo($sanitaryPermitName, PATHINFO_EXTENSION);
    if (!is_dir($uploadDirs)) {
        mkdir($uploadDir, 0777, true);
    }

    $filePath = $uploadDirs . $sanitaryPermitName;

    if (!move_uploaded_file($fileTmpPath, $filePath)) {
        echo json_encode([
            'success' => false,
            'message' => 'There was an error uploading the sanitary permit file.'
        ]);
        exit();
    }
}




// Insert and update database
$insertQuery = $conn->prepare(
    "INSERT INTO `tbl_transactions` 
    (`user_id`, `event_id`, `kiosk_id`,  `purpose`, `file_name`, `status`, `requirements`,`mayors_permit`,`business_permit`,`sanitary_permit`,  `rent_date`,`date_created`) 
    VALUES (?, ?, ?, ?, ?,?,?, ?,?, ?, ?, NOW())"
);

$updateQuery = $conn->prepare(
    "UPDATE `tbl_kiosk` 
    SET `status` = ? 
    WHERE `kiosk_id` = ? AND `event_id` = ?"
);

// Prepare notification insertion
$userMessage = 'User ' . $userName . ' submitted an application for ' . $kioskName;
$userStatus = 'unread';
$dateCreated = date('Y-m-d H:i:s');

$insertNotif = $conn->prepare(
    "INSERT INTO `tbl_notifications` (`user_id`, `message`, `status`, `date_created`)
    SELECT `user_info_id`, ?, ?, ?
    FROM `tbl_users`
    WHERE `User_type` != 'user'"
);

// Bind parameters
$insertQuery->bind_param("sssssssssss", $userId, $eventId, $kioskId, $purpose, $fileName, $status, $requirements,$mayorsPermitName,$businessPermitName,$sanitaryPermitName,$rentDate);
$updateQuery->bind_param('sis', $kioskStatus, $kioskId, $eventId);
$insertNotif->bind_param("sss", $userMessage, $userStatus, $dateCreated);

// Execute queries within a transaction
$conn->begin_transaction();
try {
    $insertQuery->execute();
    $updateQuery->execute();
    $insertNotif->execute();
    $conn->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Application successful.'
    ]);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode([
        'success' => false,
        'message' => 'Transaction failed: ' . $e->getMessage()
    ]);
    exit();
}

// Close database connection
$conn->close();
?>
