<?php
// login.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0); // Handle preflight request
}

include 'connection.php';  // Include your database connection

$data = json_decode(file_get_contents("php://input"), true);
$tokenId = $data['tokenId'] ?? '';

// Query to check if email exists
$sql = "SELECT * FROM tbl_users WHERE tokenId = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $tokenId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    // Return success response with user data and tokenId
    echo json_encode([
        'success' => true,
        'message' => 'Login successful',
        'user' => [
            'username' => $user['Username'],
            'userId' => $user['user_info_id'],
            'email' => $user['Email'],
            'firstname' => $user['First_name'],
            'lastname' => $user['Last_name'],
        ],
        'tokenId' => $user['tokenId'],
        'status' => $user['status'],
        'userType' => $user['User_type'],

        'events' => $user['access_permissions_events'],
        'transactions' => $user['access_permissions_transactions'],
        'reports' => $user['access_permissions_reports'],
        'history' => $user['access_permissions_user_settings'],
        'settings' => $user['access_permissions_access_control'],
        'control' => $user['access_permissions_history'],
    ]);

} else {
    echo json_encode(['success' => false, 'message' => 'Data not found']);
}

$conn->close();
?>