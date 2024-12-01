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

// Get POST data
$data = json_decode(file_get_contents("php://input"), true);
$username = $data['username'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';
$fname = $data['fname'] ?? '';
$lname = $data['lname'] ?? '';
$businessName = $data['businessName'] ?? '';
$contactNumber = $data['contactNumber'] ?? '';
$tokenId = $data['tokenId'] ?? uniqid(); // Generate a unique token ID if not provided
$dateCreated = date('Y-m-d H:i:s');
try {
    // Check for existing username or email
    $checkQuery = $conn->prepare("SELECT * FROM `tbl_users` WHERE `username` = ?");
    $checkQuery->bind_param("s", $username);
    $checkQuery->execute();
    $checkResult = $checkQuery->get_result();

    if ($checkResult && $checkResult->num_rows > 0) {
        echo json_encode([
            'success' => false,
            'message' => 'Username '
        ]);
        exit();
    }

    // Hash the password for security
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $insertQuery = $conn->prepare(
        "INSERT INTO `tbl_users` (`username`, `email`, `password`, `first_name`, `last_name`, `company_name`, `contact#`, `tokenId`, `user_type`, `status`, `date_registered`) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'user', '0', NOW())"
    );
    $insertQuery->bind_param("ssssssss", $username, $email, $hashedPassword, $fname, $lname, $businessName, $contactNumber, $tokenId);
        
    if ($insertQuery->execute()) {
        // Get the ID of the newly inserted user
        $userId = $conn->insert_id;

        // Add a notification for the new user
        $userMessage = 'Your account is pending';
        $userStatus = 'unread';
        $dateCreated = date('Y-m-d H:i:s');

        $insertNotif = $conn->prepare(
            "INSERT INTO `tbl_notifications` (`user_id`, `message`, `status`, `date_created`) 
            VALUES (?, ?, ?, ?)"
        );
        $insertNotif->bind_param("isss", $userId, $userMessage, $userStatus, $dateCreated);
        $insertNotif->execute();

        echo json_encode([
            'success' => true,
            'message' => 'Registration successful. Please wait for account approval.',
            'token' => $tokenId
        ]);
    } else {
        throw new Exception('Registration failed. Please try again later.');
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} finally {
    // Close the database connection
    $conn->close();
}
?>
