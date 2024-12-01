<?php
include 'connection.php';
// Fetch events
$sql = "SELECT kiosk_id, event_id, kiosk_name, status, kiosk_description, kiosk_image, position_x, position_y, transform, date_created
        FROM tbl_kiosk"; 
$result = $conn->query($sql);
$kiosk = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $kiosk[] = $row;
    }
}

// Return JSON response
header('Content-Type: application/json');
echo json_encode($kiosk);

$conn->close();
?>
