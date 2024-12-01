<?php
// create-event.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0); // Handle preflight request
}

include 'connection.php';

// Fetch the form data from $_POST and $_FILES
$eventName = $_POST['eventName'] ?? null;
$eventStart = $_POST['eventStart'] ?? null;
$eventEnd = $_POST['eventEnd'] ?? null;
$details = $_POST['details'] ?? null;
$eventImage = $_FILES['eventImage'] ?? null;

$fileName = '';
$eventImagePath = null;

// If an image was uploaded, process it
if ($eventImage != null) {
    $fileTmpPath = $_FILES['eventImage']['tmp_name'];
    $fileName = $_FILES['eventImage']['name'];
    $fileSize = $_FILES['eventImage']['size'];
    $fileType = $_FILES['eventImage']['type'];

    $newFileName = uniqid('event_', true) . '.' . pathinfo($fileName, PATHINFO_EXTENSION);
    $uploadDir = '../../../../public/dbAssets/eventImages/'; // Your uploads directory
    $uploadFile = $uploadDir . $newFileName;

    // Validate image type
    $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (in_array($fileType, $allowedTypes)) {
        if (move_uploaded_file($fileTmpPath, $uploadFile)) {
            $eventImagePath = $newFileName;
        } else {
            echo json_encode(['success' => false, 'message' => 'Error uploading image.']);
            exit();
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid file type. Only images are allowed.']);
        exit();
    }
}

// Prepare and execute the INSERT query to create a new event
$insertQuery = $conn->prepare(
    "INSERT INTO `tbl_event` 
     (`event_start`, `event_end`, `event_name`, `details`, `event_image`, `date_created`) 
     VALUES (?, ?, ?, ?, ?, NOW())"
);

$insertQuery->bind_param("sssss", $eventStart, $eventEnd, $eventName, $details, $eventImagePath);

if ($insertQuery->execute()) {
    $eventId = $conn->insert_id;

    // Insert kiosks into `tbl_kiosk`
    $stmt = $conn->prepare("INSERT INTO tbl_kiosk (position_x, position_y, kiosk_name,kiosk_image, event_id, status, date_created) VALUES (?,?, ?, ?, ?, 'available', NOW())");
    $stmt->bind_param("ddsss", $pos_x, $pos_y, $kiosk_name, $kiosk_image, $eventId);

    $kiosks = [
        [2.95, -0.05, 'kiosk 1', 'kiosk1.jpg'],
        [2.95, -0.25, 'kiosk 2', 'kiosk2.jpg'],
        [2.95, -0.45, 'kiosk 3', 'kiosk3.jpg'],
        [1.72, -0.45, 'kiosk 4', 'kiosk4.jpg'],
        [1.92, -0.45, 'kiosk 5', 'kiosk5.jpg'],
        [2.12, -0.45, 'kiosk 6', 'kiosk6.jpg'],
        [2.50, -0.45, 'kiosk 7', 'kiosk7.jpg'],
        [2.72, -0.45, 'kiosk 8', 'kiosk8.jpg'],
        [0.30, 0.25, 'kiosk 9', 'kiosk1.jpg'],
        [0.30, 0.05, 'kiosk 10', 'kiosk2.jpg'],
        [0.30, -0.15, 'kiosk 11', 'kiosk3.jpg'],
        [0.30, -0.35, 'kiosk 12', 'kiosk4.jpg'],
        [0.30, -0.55, 'kiosk 13', 'kiosk5.jpg'],
        [0.30, -0.75, 'kiosk 14', 'kiosk6.jpg'],
        [3.40, -0.28, 'kiosk 15', 'kiosk7.jpg'],
        [3.40, -0.48, 'kiosk 16', 'kiosk8.jpg'],
        [3.40, -0.68, 'kiosk 17', 'kiosk1.jpg'],
        [3.40, -0.88, 'kiosk 18', 'kiosk2.jpg']
    ];

    foreach ($kiosks as $kiosk) {
        $pos_x = $kiosk[0];
        $pos_y = $kiosk[1];
        $kiosk_name = $kiosk[2];
        $kiosk_image = $kiosk[3];

        if (!$stmt->execute()) {
            echo json_encode(['success' => false, 'message' => 'Error inserting kiosk: ' . $kiosk_name]);
            exit();
        }
    }

    echo json_encode(['success' => true, 'message' => 'Event and kiosks created successfully.', 'eventId' => $eventId]);
} else {
    echo json_encode(['success' => false, 'message' => 'Event creation failed.', 'error' => $insertQuery->error]);
}

$conn->close();
?>