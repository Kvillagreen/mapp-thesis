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

// Fetch the form data
$eventName = $_POST['eventName'] ?? null;
$eventStart = $_POST['eventStart'] ?? null;
$eventEnd = $_POST['eventEnd'] ?? null;
$details = $_POST['details'] ?? null;
$eventImage = $_FILES['eventImage'] ?? null;

// Validate inputs
if (!$eventName || !$eventStart || !$eventEnd || !$details) {
    echo json_encode(['success' => false, 'message' => 'All fields are required.']);
    exit();
}

$eventImagePath = null;

// Process uploaded image if present
if ($eventImage) {
    $fileTmpPath = $eventImage['tmp_name'];
    $fileName = $eventImage['name'];
    $fileType = $eventImage['type'];

    $newFileName = uniqid('event_', true) . '.' . pathinfo($fileName, PATHINFO_EXTENSION);
    $uploadDir = '../../public/dbAssets/eventImages/'; // Directory for uploaded files
    $uploadFile = $uploadDir . $newFileName;

    $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!in_array($fileType, $allowedTypes)) {
        echo json_encode(['success' => false, 'message' => 'Invalid file type. Only images are allowed.']);
        exit();
    }

    if (!move_uploaded_file($fileTmpPath, $uploadFile)) {
        echo json_encode(['success' => false, 'message' => 'Error uploading image.']);
        exit();
    }

    $eventImagePath = $newFileName;
}

try {
    $conn->begin_transaction();

    // Insert event
    $insertEventQuery = $conn->prepare("
        INSERT INTO tbl_event 
        (event_start, event_end, event_name, details, event_image, date_created) 
        VALUES (?, ?, ?, ?, ?, NOW())
    ");
    $insertEventQuery->bind_param("sssss", $eventStart, $eventEnd, $eventName, $details, $eventImagePath);

    if (!$insertEventQuery->execute()) {
        throw new Exception("Event creation failed: " . $insertEventQuery->error);
    }
    $eventId = $conn->insert_id;

    // Insert kiosks
    $insertKioskQuery = $conn->prepare("
        INSERT INTO tbl_kiosk 
        (position_x, position_y, kiosk_name, kiosk_image, event_id, status, date_created) 
        VALUES (?, ?, ?, ?, ?, 'available', NOW())
    ");

    $kiosks = [
        [2.95, -0.05, 'kiosk 1', 'kiosk1.jpg'],
        [2.95, -0.25, 'kiosk 2', 'kiosk2.jpg'],
        [2.95, -0.45, 'kiosk 3', 'kiosk3.jpg'],
        [1.72, -0.45, 'kiosk 4', 'kiosk4.jpg'],
        [1.92, -0.45, 'kiosk 5', 'kiosk5.jpg'],
        [2.12, -0.45, 'kiosk 6', 'kiosk6.jpg'],
        [2.50, -0.45, 'kiosk 7', 'kiosk7.jpg'],
        [2.72, -0.45, 'kiosk 8', 'kiosk8.jpg'],
        [0.30, 0.25, 'kiosk 9', 'kiosk9.jpg'],
        [0.30, 0.05, 'kiosk 10', 'kiosk10.jpg'],
        [0.30, -0.15, 'kiosk 11', 'kiosk11.jpg'],
        [0.30, -0.35, 'kiosk 12', 'kiosk12.jpg'],
        [0.30, -0.55, 'kiosk 13', 'kiosk13.jpg'],
        [0.30, -0.75, 'kiosk 14', 'kiosk14.jpg'],
        [3.40, -0.28, 'kiosk 15', 'kiosk15.jpg'],
        [3.40, -0.48, 'kiosk 16', 'kiosk16.jpg'],
        [3.40, -0.68, 'kiosk 17', 'kiosk17.jpg'],
        [3.40, -0.88, 'kiosk 18', 'kiosk18.jpg']
    ];

    foreach ($kiosks as $kiosk) {
        [$posX, $posY, $kioskName, $kioskImage] = $kiosk;
        $insertKioskQuery->bind_param("ddsss", $posX, $posY, $kioskName, $kioskImage, $eventId);
        if (!$insertKioskQuery->execute()) {
            throw new Exception("Error inserting kiosk: " . $kioskName);
        }
    }
    $insertNotificationQuery = $conn->prepare("
    INSERT INTO tbl_notifications (user_id, message, status, date_created)
    SELECT user_info_id, CONCAT('New event ', ?, ' created'), 'unread', NOW()
    FROM tbl_users
    WHERE user_type = 'user'
    ");

    // Bind the event name parameter to the query
    $insertNotificationQuery->bind_param("s", $eventName);


    if (!$insertNotificationQuery->execute()) {
        throw new Exception("Error creating notifications.");
    }

    $conn->commit();

    echo json_encode(['success' => true, 'message' => 'Event, kiosks, and notifications created successfully.', 'eventId' => $eventId]);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} finally {
    $conn->close();
}
?>
