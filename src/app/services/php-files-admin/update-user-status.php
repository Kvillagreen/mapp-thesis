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
$userId = $data['userId'] ?? null;
$status = $data['status'] ?? '';

// Prepare the UPDATE query
$updateQuery = $conn->prepare(
    "UPDATE `tbl_users` 
     SET `status` = ? 
     WHERE `user_info_id` = ? "
);
$updateQuery->bind_param("si", $status, $userId);

if ($updateQuery->execute()) {

    $userStatus = 'unread';
    $dateCreated = date('Y-m-d H:i:s');
    if($status=='1'){
        $status='approved';
    }
    else if($status=='2'){
        $status='denied';
    }
    else if($status=='0'){
        $status='pending';
    }
    
    $userMessage = 'Your account has already been updated to ' . $status;
    $insertNotif = $conn->prepare(
        "INSERT INTO `tbl_notifications` (`user_id`, `message`, `status`, `date_created`) 
        VALUES (?, ?, ?, ?)"
    );
    $insertNotif->bind_param("isss", $userId, $userMessage, $userStatus, $dateCreated);
    $insertNotif->execute();
    // Prepare the INSERT query
    echo json_encode([
        'success' => true,
        'message' => 'User updated and notification added successfully!'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'User update failed!',
        'error' => $updateQuery->error // Include error for debugging
    ]);
}

$conn->close(); // Always close the connection
?>