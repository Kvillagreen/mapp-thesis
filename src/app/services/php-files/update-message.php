<?php
// registration.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0); // Handle preflight request
}

include 'connection.php';

$data = json_decode(file_get_contents("php://input"), true);

// Correctly extract data from the input
$notificationId = $data['notificationId'] ?? Null;
$status = $data['status'] ?? Null;

// Corrected UPDATE query
$updateQuery = $conn->prepare(
    "UPDATE `tbl_notifications` 
     SET `status` = ? 
     WHERE `notification_id` = ?"
);

$updateQuery->bind_param("ss", $status, $notificationId);

if ($updateQuery->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Account updated successfully!'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Account update failed!',
        'error' => $updateQuery->error // Include error for debugging
    ]);
}
?>
