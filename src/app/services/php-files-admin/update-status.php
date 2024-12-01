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
$formId = $data['formId'] ?? null;
$eventId = $data['eventId'] ?? null;
$kioskId = $data['kioskId'] ?? null;
$userId = $data['userId'] ?? null;
$status = $data['status'] ?? null;
$message = 'Your transaction has been ' . $status; // Concatenation fixed

// Prepare the UPDATE query
$updateQuery = $conn->prepare(
    "UPDATE `tbl_transactions` 
     SET `status` = ? 
     WHERE `form_id` = ? AND `event_id` = ? AND `user_id` = ? AND `kiosk_id` = ?"
);
$updateQuery->bind_param("siiii", $status, $formId, $eventId, $userId, $kioskId);

if ($updateQuery->execute()) {
    // Prepare the INSERT query
    $insertQuery = $conn->prepare(
        "INSERT INTO `tbl_notifications` (`message`, `status`, `date_created`, `user_id`) 
         VALUES (?, 'unread', NOW(), ?)"
    );
    $insertQuery->bind_param("si", $message, $userId);

    if ($insertQuery->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Transaction updated and notification added successfully!'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Failed to add notification!',
            'error' => $insertQuery->error
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Transaction update failed!',
        'error' => $updateQuery->error // Include error for debugging
    ]);
}

$conn->close(); // Always close the connection
?>
