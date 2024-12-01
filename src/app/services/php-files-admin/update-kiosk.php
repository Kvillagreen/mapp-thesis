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
$kioskId = $_POST['kioskId'] ?? null;
$kioskName = $_POST['kioskName'] ?? null;
$status = $_POST['status'] ?? null;
$kioskDescription = $_POST['kioskDescription'] ?? null;
$posx = $_POST['posx'] ?? null;
$posy = $_POST['posy'] ?? null;
$kioskImage = $_FILES['kioskUploadImage'] ?? null;

$fileName = '';

if ($kioskImage != null) {
    $fileTmpPath = $_FILES['kioskUploadImage']['tmp_name'];
    $fileName = $_FILES['kioskUploadImage']['name'];
    $fileSize = $_FILES['kioskUploadImage']['size'];
    $fileType = $_FILES['kioskUploadImage']['type'];

    $newFileName = uniqid('kiosk', true) . '.' . pathinfo($fileName, PATHINFO_EXTENSION);
    $uploadDir = '../../../../public/dbAssets/kioskImages/'; // Your uploads directory
    $uploadFile = $uploadDir . $newFileName;

    // Validate image type
    $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (in_array($fileType, $allowedTypes)) {
        if (move_uploaded_file($fileTmpPath, $uploadFile)) {
            $kioskImage = $newFileName;

            // Prepare and execute the UPDATE query for the image
            $updateImageQuery = $conn->prepare(
                "UPDATE `tbl_kiosk` SET `kiosk_image` = ? WHERE `kiosk_id` = ?"
            );
            $updateImageQuery->bind_param("si", $newFileName, $kioskId);

            if (!$updateImageQuery->execute()) {
                echo json_encode([
                    'success' => false,
                    'message' => 'Image update failed.',
                    'error' => $updateImageQuery->error,
                ]);
                exit();
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

// Prepare and execute the UPDATE query for other fields
$updateQuery = $conn->prepare(
    "UPDATE `tbl_kiosk` 
     SET `kiosk_name` = ?, 
         `status` = ?, 
         `kiosk_description` = ?, 
         `position_x` = ?, 
         `position_y` = ? 
     WHERE `kiosk_id` = ?"
);

$updateQuery->bind_param("sssssi", $kioskName, $status, $kioskDescription, $posx, $posy, $kioskId);

if ($updateQuery->execute()) {
    echo json_encode(['success' => true, 'message' => 'Kiosk updated successfully.']);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Kiosk update failed.',
        'error' => $updateQuery->error,
    ]);
}

$conn->close();
?>
