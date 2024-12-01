<?php
// login.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

include 'connection.php'; // Include your database connection

// Get POST data
$data = json_decode(file_get_contents("php://input"), true);
$input = $data['email'] ?? ''; // Input can be email or username
$password = $data['password'] ?? '';

// Validate input
if (empty($input) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Email/Username and password are required']);
    exit;
}

// Determine if input is email or username
if (filter_var($input, FILTER_VALIDATE_EMAIL)) {
    $sql = "SELECT * FROM tbl_users WHERE Email = ?";
} else {
    $sql = "SELECT * FROM tbl_users WHERE Username = ?";
}

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $input);
$stmt->execute();
$result = $stmt->get_result();

// Check if user exists
if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();

    // Verify the password
    if (password_verify($password, $user['Password'])) {
        // Success response with user data and permissions
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
            'tokenId' => $user['tokenId'] ?? null, // Optional field
            'status' => $user['status'],
            'userType' => $user['User_type'],
            'permissions' => [
                'events' => $user['access_permissions_events'] ?? null,
                'transactions' => $user['access_permissions_transactions'] ?? null,
                'reports' => $user['access_permissions_reports'] ?? null,
                'history' => $user['access_permissions_history'] ?? null,
                'settings' => $user['access_permissions_user_settings'] ?? null,
                'control' => $user['access_permissions_access_control'] ?? null,
            ],
        ]);
    } else {
        // Invalid password
        echo json_encode(['success' => false, 'message' => 'Invalid password']);
    }
} else {
    // User not found
    echo json_encode(['success' => false, 'message' => 'User not found']);
}

// Close database connection
$stmt->close();
$conn->close();
