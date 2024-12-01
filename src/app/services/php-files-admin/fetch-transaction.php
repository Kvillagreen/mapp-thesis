<?php
include 'connection.php';

// Fetch input data
$data = json_decode(file_get_contents("php://input"), true);

// Initialize response variables
$userId = '';
$notification = [];

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
        f.file_size,
        f.file_type,
        f.file_name,
        f.date_created,
        k.kiosk_name,
        e.event_name,
        u.Username,
        u.First_name,
        u.Last_name,
        u.Email
    FROM 
        tbl_transactions f
    INNER JOIN 
        tbl_kiosk k ON f.kiosk_id = k.kiosk_id
    INNER JOIN 
        tbl_event e ON f.event_id = e.event_id
    INNER JOIN 
        tbl_users u ON f.user_id = u.user_info_id
   
";
$stmt = $conn->prepare($sql);// Assuming user_id is a string
$stmt->execute();
$result2 = $stmt->get_result();

if ($result2->num_rows > 0) {
    while ($row = $result2->fetch_assoc()) {
        $notification[] = $row; // Append each notification to the array
    }
}

// Step 3: Return JSON response
header('Content-Type: application/json');
echo json_encode($notification);

// Close the connection
$conn->close();
?>