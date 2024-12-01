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
$receiptNumber = $data['receiptNumber'] ?? Null;
$formId = $data['formId'] ?? Null;
$status = 'paid';

// Corrected UPDATE query
$updateQuery = $conn->prepare(
    "UPDATE `tbl_transactions` 
     SET `receipt_number` = ?, `status` = ? 
     WHERE `form_id` = ?"
);

$updateQuery->bind_param("sss", $receiptNumber, $status, $formId);

if ($updateQuery->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Transaction updated successfully!'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Transaction update failed!',
        'error' => $updateQuery->error // Include error for debugging
    ]);
}
?>
