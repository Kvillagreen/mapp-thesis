<?php
include 'connection.php';

// Fetch input data
$data = json_decode(file_get_contents("php://input"), true);
$tokenId = $data['tokenId'] ?? '8d7859-29b4-414c-9fe1-7ec187f92e92';

// Initialize response variables
$userId = '';
$notification = [];

// Step 1: Fetch the user ID using the provided tokenId
$sql = "SELECT user_info_id FROM tbl_users WHERE tokenId = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $tokenId); // Assuming tokenId is a string
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $userId = $row['user_info_id']; // Fetch user_info_id
}

// Step 2: Fetch notifications if a user ID was found
if (!empty($userId)) {
    $sql = "
    SELECT 
        f.form_id,
        f.user_id,
        f.event_id,
        f.kiosk_id,
        f.date_req,
        f.purpose,
        f.status,
        f.receipt_number,
        f.file_name,
        f.date_created,
        k.kiosk_name,
        e.event_name
    FROM 
        tbl_transactions f
    INNER JOIN 
        tbl_kiosk k ON f.kiosk_id = k.kiosk_id
    INNER JOIN 
        tbl_event e ON f.event_id = e.event_id
    WHERE 
        f.user_id = ?
";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $userId); // Assuming user_id is a string
    $stmt->execute();
    $result2 = $stmt->get_result();

    if ($result2->num_rows > 0) {
        while ($row = $result2->fetch_assoc()) {
            $notification[] = $row; // Append each notification to the array
        }
    }
}

// Step 3: Return JSON response
header('Content-Type: application/json');
echo json_encode($notification);

// Close the connection
$conn->close();
?>
