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
$eventId = $data['eventId'] ?? null;
$status = 0;

// Prepare the UPDATE query
$updateQuery = $conn->prepare(
    "UPDATE `tbl_event` 
     SET `status` = ? 
     WHERE `event_id` = ? "
);
$updateQuery->bind_param("si", $status, $eventId);

if ($updateQuery->execute()) {
    // Prepare the INSERT query
    echo json_encode([
        'success' => true,
        'message' => 'Transaction updated and notification added successfully!'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Transaction update failed!',
        'error' => $updateQuery->error // Include error for debugging
    ]);
}

$conn->close(); // Always close the connection
?>