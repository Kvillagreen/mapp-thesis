<?php
// update-event.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0); // Handle preflight request
}

include 'connection.php';

// Fetch the form data from $_POST and $_FILES
$eventId = $_POST['eventId'] ?? null;
$eventName = $_POST['eventName'] ?? null;
$eventStart = $_POST['eventStart'] ?? null;
$eventEnd = $_POST['eventEnd'] ?? null;
$details = $_POST['details'] ?? null;
$status = $_POST['status'] ?? null;
$eventImage = $_FILES['eventImage'] ?? null;

$fileName = '';

if ($eventImage != null) {
    $fileTmpPath = $_FILES['eventImage']['tmp_name'];
    $fileName = $_FILES['eventImage']['name'];
    $fileSize = $_FILES['eventImage']['size'];
    $fileType = $_FILES['eventImage']['type'];

    $newFileName = uniqid('event_', true) . '.' . pathinfo($fileName, PATHINFO_EXTENSION);
    $uploadDir = '../../../../public/dbAssets/eventImages/'; // Your uploads directory
    $uploadFile = $uploadDir . $newFileName;

    // Validate image type (optional: better validation can be done here)
    $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (in_array($fileType, $allowedTypes)) {
        if (move_uploaded_file($fileTmpPath, $uploadFile)) {
            $eventImage = $newFileName;

            // Prepare and execute the UPDATE query
            $updateQuery = $conn->prepare(
                "UPDATE `tbl_event` SET `event_image` = ? WHERE `event_id` = ?"
            );
            $updateQuery->bind_param("si", $eventImage, $eventId);
            if ($updateQuery->execute()) {

            } else {
                echo json_encode(['success' => false, 'message' => 'Event update failed.', 'error' => $updateQuery->error]);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Error uploading image.']);
            exit();
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid file type. Only images are allowed.']);
        exit();
    }
}

// Prepare and execute the UPDATE query
$updateQuery = $conn->prepare(
    "UPDATE `tbl_event` 
     SET `event_start` = ?, 
         `event_end` = ?, 
         `event_name` = ?, 
         `details` = ?, 
         `status` = ?
     WHERE `event_id` = ?"
);
$updateQuery->bind_param("sssssi", $eventStart, $eventEnd, $eventName, $details, $status, $eventId);

if ($updateQuery->execute()) {
    echo json_encode(['success' => true, 'message' => 'Event updated successfully.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Event update failed.', 'error' => $updateQuery->error]);
}

$conn->close();
?>